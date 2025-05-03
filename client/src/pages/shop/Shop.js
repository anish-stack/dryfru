
import { useState, useEffect } from "react"
import { Search, Filter, Home, ChevronRight, ShoppingBag, Package2, X, Star } from "lucide-react"
import axios from 'axios'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const productsPerPage = 12

  // Calculate discount price if null
  const calculateDiscountPrice = (price, discountPercentage) => {
    if (!price) return null
    if (!discountPercentage) return price
    return price - price * (discountPercentage / 100)
  }

  // Process products to ensure all necessary values are calculated
  const processProducts = (productsData) => {
    return productsData.map((product) => {
      // Handle non-variant products
      if (!product.isVarient) {
        const discountPercentage = product.discount || 0
        const afterDiscountPrice =
          product.afterDiscountPrice || calculateDiscountPrice(product.price, discountPercentage)

        return {
          ...product,
          discount: discountPercentage,
          afterDiscountPrice: afterDiscountPrice,
        }
      }

      // Handle variant products
      const processedVariants = product.Varient.map((variant) => {
        const discountPercentage = variant.discount_percentage || 0
        const priceAfterDiscount =
          variant.price_after_discount || calculateDiscountPrice(variant.price, discountPercentage)

        return {
          ...variant,
          discount_percentage: discountPercentage,
          price_after_discount: priceAfterDiscount,
        }
      })

      // Use the first variant's price for display if product price is null
      const firstVariant = processedVariants[0] || {}
      const productPrice = product.price || firstVariant.price || 0
      const productDiscount = product.discount || firstVariant.discount_percentage || 0
      const productAfterDiscountPrice = product.afterDiscountPrice || firstVariant.price_after_discount || productPrice

      return {
        ...product,
        Varient: processedVariants,
        price: productPrice,
        discount: productDiscount,
        afterDiscountPrice: productAfterDiscountPrice,
      }
    })
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://api.dyfru.com/api/v1/get-product');
      const processedProducts = processProducts(response.data.products)
      setProducts(processedProducts)
      setFilteredProducts(processedProducts)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.product_description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category && product.category.name === categoryFilter)
    }

    // Apply stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter((product) => {
        if (stockFilter === "inStock") {
          return product.isVarient ? product.Varient.some((v) => v.stock_quantity > 0) : product.stock > 0
        } else {
          return product.isVarient ? product.Varient.every((v) => v.stock_quantity <= 0) : product.stock <= 0
        }
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.afterDiscountPrice || 0) - (b.afterDiscountPrice || 0))
        break
      case "price-desc":
        filtered.sort((a, b) => (b.afterDiscountPrice || 0) - (a.afterDiscountPrice || 0))
        break
      case "name-asc":
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.product_name.localeCompare(a.product_name))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [searchQuery, products, sortBy, stockFilter, categoryFilter])

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleVariantSelect = (productId, variantId) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [productId]: variantId,
    }))
  }

  // Get unique categories from products
  const categories = [
    "all",
    ...new Set(
      products.filter((product) => product.category && product.category.name).map((product) => product.category.name),
    ),
  ]

  // Format price with commas for Indian currency format
  const formatPrice = (price) => {
    if (!price) return "0"
    return price.toLocaleString("en-IN")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <p className="mt-4 text-emerald-600 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Premium Dry Fruits & Nuts</h1>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Discover our handpicked selection of premium quality dry fruits, nuts, and healthy snacks
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-emerald-600 font-medium">Shop</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package2 className="w-7 h-7 text-emerald-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Products</h1>
                <p className="text-gray-500 text-sm mt-1">Premium quality, naturally sourced</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 bg-emerald-50 px-4 py-2 rounded-full">
              <span>Total: {products.length}</span>
              <span className="h-4 w-px bg-gray-300"></span>
              <span>Showing: {filteredProducts.length}</span>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block lg:w-1/4`}>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        type="radio"
                        name="category"
                        checked={categoryFilter === category}
                        onChange={() => setCategoryFilter(category)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {category === "all" ? "All Categories" : category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="stock-all"
                      type="radio"
                      name="stock"
                      checked={stockFilter === "all"}
                      onChange={() => setStockFilter("all")}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="stock-all" className="ml-2 text-sm text-gray-700">
                      All Items
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="stock-in"
                      type="radio"
                      name="stock"
                      checked={stockFilter === "inStock"}
                      onChange={() => setStockFilter("inStock")}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="stock-in" className="ml-2 text-sm text-gray-700">
                      In Stock
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="stock-out"
                      type="radio"
                      name="stock"
                      checked={stockFilter === "outOfStock"}
                      onChange={() => setStockFilter("outOfStock")}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="stock-out" className="ml-2 text-sm text-gray-700">
                      Out of Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {currentProducts.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-emerald-600 mb-4">
                  <Search className="w-16 h-16 mx-auto opacity-30" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => {
                  // Get selected variant or first variant
                  const selectedVariantId = selectedVariant[product._id]
                  const selectedVariantObj =
                    (product.isVarient && product.Varient.find((v) => v._id === selectedVariantId)) ||
                    (product.isVarient ? product.Varient[0] : null)

                  // Determine prices to display
                  const displayPrice =
                    product.isVarient && selectedVariantObj ? selectedVariantObj.price : product.price

                  const displayDiscountPrice =
                    product.isVarient && selectedVariantObj
                      ? selectedVariantObj.price_after_discount
                      : product.afterDiscountPrice

                  const displayDiscount =
                    product.isVarient && selectedVariantObj ? selectedVariantObj.discount_percentage : product.discount

                  // Check if product is in stock
                  const isInStock = product.isVarient
                    ? selectedVariantObj
                      ? selectedVariantObj.stock_quantity > 0
                      : false
                    : product.stock > 0

                  return (
                    <div
                    

                      key={product._id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="relative pb-[100%]">
                        <img
                          src={product.ProductMainImage.url || "/placeholder.svg"}
                          alt={product.product_name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {displayDiscount > 0 && (
                          <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {displayDiscount}% OFF
                          </div>
                        )}
                        {!isInStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-medium px-4 py-2 bg-gray-800 bg-opacity-75 rounded-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          {product.category && (
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              {product.category.name}
                            </span>
                          )}
                          <div className="ml-auto flex items-center">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium ml-1">4.8</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.product_name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.product_description}</p>

                        {product.isVarient && (
                          <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Select Quantity</label>
                            <select
                              value={selectedVariant[product._id] || ""}
                              onChange={(e) => handleVariantSelect(product._id, e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                              {product.Varient.map((variant) => (
                                <option key={variant._id} value={variant._id}>
                                  {variant.quantity} - ₹{formatPrice(variant.price_after_discount || variant.price)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div   onClick={() =>
                              (window.location.href = `/productpage/${product?._id}?name=${encodeURIComponent(
                                product?.product_name.replace(/\s+/g, '-').toLowerCase()
                              )}`)
                              } className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-emerald-600">
                                ₹{formatPrice(displayDiscountPrice)}
                              </span>
                              {displayPrice !== displayDiscountPrice && displayPrice > 0 && (
                                <span className="text-sm text-gray-500 line-through">₹{formatPrice(displayPrice)}</span>
                              )}
                            </div>
                            {product.isVarient && selectedVariantObj && (
                              <span className="text-xs text-gray-500">{selectedVariantObj.quantity}</span>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              (window.location.href = `/productpage/${product?._id}?name=${encodeURIComponent(
                                product?.product_name.replace(/\s+/g, '-').toLowerCase()
                              )}`)
                              }
                            className={`p-2.5 rounded-full transition-colors ${!isInStock
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            disabled={!isInStock}
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-600 hover:bg-emerald-50"
                    }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm ${currentPage === page ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-emerald-50"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-600 hover:bg-emerald-50"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}


    </div>
  )
}
