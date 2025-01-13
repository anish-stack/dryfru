const Ordermodel = require('../models/Order.model')
const Product = require('../models/Product.model')
const Crypto = require('crypto');
const PaymentService = require('../services/Payment.service');
const { initiatePayment } = require('../utils/Pay');
const axios = require('axios');
async function toCheckStock(product_id, stock, isVarientTrue = false, Varient_id) {
    try {
        const product = await Product.findById(product_id);
        if (!product) {
            throw new Error('Product Not Found');
        }

        if (isVarientTrue === false) {
            if (product.stock < stock) {
                throw new Error(`Not enough stock for the product: ${product.name}. Available stock: ${product.stock}`);
            }
        } else {
            const varient = product.Varient.find((item) => item._id.toString() === Varient_id);
            if (!varient) {
                throw new Error('Variant Not Found');
            }
            if (varient.stock_quantity < stock) {
                throw new Error(`Not enough stock for the variant: ${varient.quantity}. Available stock: ${varient.stock_quantity}`);
            }
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}
async function generateUniqueOrderId() {
    const startString = 'ORD';
    let order_id;
    let orderExists = true;

    while (orderExists) {

        const OrderNo = Crypto.randomInt(1000000, 9999999);
        order_id = startString + OrderNo;

        const order = await Ordermodel.findOne({ orderId: order_id });

        if (!order) {
            orderExists = false;
        }
    }

    return order_id;
}


exports.createOrderOfProduct = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.body.items)

        const user = req.user.id?._id || null
        const order_id = await generateUniqueOrderId();

        const { items, totalAmount, payAmt, isVarientInCart, paymentType, offerId, shipping } = req.body;

        for (let item of items) {
            const { product_id, Qunatity, variantId } = item;

            const isVarientTrue = isVarientInCart && variantId ? true : false;

            const stockCheck = await toCheckStock(product_id, Qunatity, isVarientTrue, variantId);

            if (!stockCheck) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock check failed for one or more products. Please try again later.'
                });
            }
        }
        const orderItems = items.map(item => ({
            productId: item.product_id,
            varient_type: {
                id: item.variantId || null,
                text: item.variant || ''
            },
            name: item.product_name,
            quantity: item.Qunatity,
            price: item.price_after_discount,
        }));


        const newOrder = new Ordermodel({
            userId: user,
            orderId: order_id,
            items: orderItems,
            totalAmount,
            payAmt,
            paymentType,
            offerId,
            shipping,
            status: 'pending',
            totalquantity: items.length || 0
        });


        const savedOrder = await newOrder.save();

        if (paymentType === 'ONLINE') {

            return await initiatePayment(req, res, newOrder)
        } else {
            return res.status(200).json({
                success: true,
                message: 'Order has been successfully created and placed in pending status.',
                order: newOrder
            });
        }



    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

exports.ChangeOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const Order = await Ordermodel.findById(orderId);
        if (!Order) {
            return res.status(404).json({
                success: false,
                message: 'Sorry, we couldn\'t find the order. Please check the order ID and try again.'
            });
        }

        if (Order.status === 'confirmed' || Order.status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: `The order has already been marked as ${Order.status}. It cannot be updated at this time.`
            });
        }

        if (status === 'confirmed') {
            for (let item of Order.items) {
                const { productId, quantity, varient_type } = item;

                const isVarientTrue = varient_type.id ? true : false;
                console.log(isVarientTrue)

                const stockCheck = await toCheckStock(productId, quantity, isVarientTrue, varient_type?.id);

                if (!stockCheck) {
                    return res.status(400).json({
                        success: false,
                        message: 'Stock check failed for one or more products. Please try again later.'
                    });
                }


                const product = await Product.findById(productId);
                if (isVarientTrue) {
                    const varient = product.Varient.find((item) => item._id.toString() === varient_type?.id);
                    if (varient) {
                        varient.stock_quantity -= quantity;
                    }
                } else {
                    product.stock -= quantity;
                }
                await product.save();
            }
        }


        if (status === 'cancelled') {

            Order.status = status;
            await Order.save();

            return res.status(200).json({
                success: true,
                message: 'The order has been cancelled successfully!'
            });
        }


        Order.status = status;
        await Order.save();

        return res.status(200).json({
            success: true,
            message: 'The order status has been updated successfully!'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Oops! Something went wrong. Please try again later.'
        });
    }
};
exports.OrderProcessRating = async (req, res) => {
    try {
        const orderId = req.params.orderid;
        const { OrderProcessRating } = req.body;
        console.log(req.body)

        const orderData = await Ordermodel.findOne({ orderId: orderId })
        console.log(orderData)
        if (!orderData) {
            return res.status(404).json({
                success: false,
                message: 'Order not found. Please check the order ID and try again.',
            });
        }
        orderData.OrderProcessRating = OrderProcessRating
        await orderData.save();
        console.log("save",orderData)
        return res.status(200).json({
            success: true,
            message: 'Thank you for sharing your feedback! Your rating has been successfully added to your order.',
            updatedOrder: orderData,
        });

    } catch (error) {
        console.error('Error updating order process rating:', error);


        return res.status(500).json({
            success: false,
            message: 'An error occurred while adding the rating. Please try again later.',
            error: error.message,
        });
    }
};

exports.getAllOrder = async (req, res) => {
    try {
        const { page = 1, search = '', startDate, endDate, orderStatus, limit } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { 'userId.Name': { $regex: search, $options: 'i' } },
                { orderId: { $regex: search, $options: 'i' } },
            ];
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (orderStatus) {
            query.status = orderStatus;
        }

        const limits = limit;
        const orders = await Ordermodel.find(query)
            .populate('userId')
            .skip((page - 1) * limits)
            .limit(limits);

        return res.status(200).json({
            success: true,
            totalPages: Math.ceil(await Ordermodel.countDocuments(query) / limits),
            total: orders.length,
            currentPage: page,
            data: orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Oops! Something went wrong. Please try again later.'
        });
    }
}

exports.getOrderByOrderId = async (req, res) => {
    try {
        const userId = req.user?.id?._id;
        const orderId = req.params.orderId;
        console.log(orderId)
        console.log(userId)



        const order = await Ordermodel.findOne({
            userId: userId,
            orderId: orderId
        }).populate('userId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'We couldn’t find an order with the provided ID. Please double-check the order ID and try again.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order retrieved successfully.',
            data: order,
        });
    } catch (error) {

        console.error('Error fetching order:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while retrieving the order. Please try again later.',
            error: error.message,
        });
    }
};



exports.getMyLastOrder = async (req, res) => {
    try {

        const user = req.user?.id?._id || null;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not logged in or ID is invalid."
            });
        }

        // Find the latest order for the user
        const order = await Ordermodel.findOne({ userId: user }).sort({ createdAt: -1 });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user."
            });
        }

        return res.status(200).json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error("Error fetching last order:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the last order.",
            error: error.message
        });
    }
};

exports.getMyAllOrder = async (req, res) => {
    try {

        const user = req.user?.id?._id || null;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not logged in or ID is invalid."
            });
        }

        // Find the latest order for the user
        const order = await Ordermodel.find({ userId: user }).sort({ createdAt: -1 });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user."
            });
        }

        return res.status(200).json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error("Error fetching last order:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the last order.",
            error: error.message
        });
    }
};

exports.checkStatus = async (req, res) => {
    const { merchantTransactionId } = req.params;

    if (!merchantTransactionId) {
        return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
    }

    try {
        const merchantId = process.env.PHONEPE_MERCHANT_ID || 'TESTPGPAYCREDUAT';
        const apiKey = process.env.PHONEPE_MERCHANT_KEY || '14d6df8a-75bf-4873-9adf-43bc1545094f';
        const keyIndex = 1;

        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}${apiKey}`;
        const sha256 = Crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const testUrlCheck = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

        const options = {
            method: 'GET',
            url: testUrlCheck,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchantId
            }
        };


        const { data } = await axios.request(options);


        if (data.success === true) {
            console.log(merchantTransactionId)
            const findOrder = await Ordermodel.findOne({ 'payment.phonepeOrderId': merchantTransactionId });

            if (findOrder) {
                findOrder.payment = {
                    method: data.data?.paymentInstrument?.type,
                    transactionId: data.data?.transactionId,
                    isPaid: true,
                    status: data.data?.state,
                    paidAt: new Date()
                }

                await findOrder.save();
            }
            console.log(findOrder)
            const successRedirect = `https://dyfru.com/Receipt/order-confirmed?id=${merchantTransactionId}&success=true&data=${findOrder?.orderId}`;

            return res.redirect(successRedirect);
        } else {
            const failureRedirect = "https://panandacademy.com/payment-failed";
            return res.redirect(failureRedirect);
        }

    } catch (error) {
        console.error("Error in checkStatus:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};
