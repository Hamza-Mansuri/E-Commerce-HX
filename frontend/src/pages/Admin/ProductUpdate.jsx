import { useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router"

import { 
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImageMutation,
    useGetProductByIdQuery,
    useAllProductsQuery
} from "../../redux/api/productApiSlice"

import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice"

import { toast } from "react-toastify"

import AdminMenu from "./AdminMenu"

const ProductUpdate = () => {

  const params = useParams()

  const {data: productData} = useGetProductByIdQuery(params._id)

  const [image, setImage] = useState(productData?.image || "")
  const [name, setName] = useState(productData?.name || "")
  const [price, setPrice] = useState(productData?.price || "")
  const [description, setDescription] = useState(productData?.description || "")
  const [brand, setBrand] = useState(productData?.brand || "")
  const [quantity, setQuantity] = useState(productData?.quantity || "")
  const [category, setCategory] = useState(productData?.category || "")
  
  const [stock, setStock] = useState(productData?.countInStock)

  const navigate = useNavigate()

  const {data: categories = [] } = useFetchCategoriesQuery()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [uploadProductImage] = useUploadProductImageMutation()

  useEffect(() => {

      if(productData && productData._id)
      {
          setName(productData.name)
          setImage(productData.image)
          setPrice(productData.price)
          setDescription(productData.description)
          setBrand(productData.brand)
          setQuantity(productData.quantity)
          // setStock(productData.stock)
          setCategory(productData.category)
      }
  }, [productData])


  const uploadFileHandler = async(e) => {

    e.preventDefault()

    const formData = new FormData()
    formData.append('image', e.target.files[0])

    try 
    {
    
      const res = await uploadProductImage(formData).unwrap()
      toast.success("Item Added Successfully")
      setImage(res.image)

    } catch (error) {
      console.error(error)
      toast.error(error?.data?.message || error.message)
    }
  }

  

  const handleSubmit = async(e) => {

    e.preventDefault()

    try 
    {
    
      const formData = new FormData();

      formData.append('image', image)
      formData.append('name', name)
      formData.append('price', price)
      formData.append('brand', brand)
      formData.append('description', description)
      formData.append('quantity', quantity)
      formData.append('countInStock', stock)
      formData.append('category', category)

      console.log(formData);
      

      const {data} = await updateProduct({productId: params._id, formData})

      if(!data)
      {
        toast.error("Product Update Failed")
        //Actual Error
        toast.error(data.error)
      }
      else
      {
        toast.success(`${data.name} is Updated`)
        navigate('/admin/allproductslist')
      }

    } catch (error) {
      console.error(error.message)
      toast.error(error?.data?.message || error.message)
    }
  }

  const {refetch: refetchProducts} = useAllProductsQuery()

  const handleDelete = async(e) => {

    try 
    {
    
      const answer = window.confirm("Are You Sure That You Want to Delete?")

      if(!answer) return;

      const {data} = await deleteProduct(params._id)
      toast.success(`${data.name} is Deleted`)
      navigate('/admin/allproductslist')

      refetchProducts();

    } catch (error) {
      console.error(error)
      toast.error("Delete Failed")
    }    
  }

  return (
    //CG
    <div className="container xl:mx-[9-rem] sm:mx-[0] pl-16">
        <div className="flex flex-col md:flex-row">

            {/* Admin Menu */}
            <AdminMenu/>

            <div className="md:w-3/4 p-3">
            <div className="h-12">Create Product</div>

            {/* if we have imageURL render the content in (), if we don't, don't need to render at all */}
            {image && (
                <div className="text-center">
                <img 
                    src={image} 
                    alt="product" 
                    className="block mx-auto max-h-[200px]"
                />
                </div>
            )}

            {/* div of upload image */}
            <div className="mb-3">
                <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {/* if we have image, it shows its name, otherwise upload image */}
                {image ? image.name : "Upload Image"}

                <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    // created a proxy for that
                    onChange={uploadFileHandler}
                    className={!image ? "hidden" : "text-white"}
                />
                </label>
            </div>

            {/* Name section */}
            <div className="p-3">
                <div className="flex flex-wrap gap-4">
                {/* Name Section */}
                <div className="flex flex-col mb-3 w-[48%]">
                    <label 
                    htmlFor="name" 
                    className="text-white font-semibold mb-1"
                    >
                    Name
                    </label>
                    <input 
                    type="text" 
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                </div>

                {/* Price Section */}
                <div className="flex flex-col mb-3 w-[48%]">
                    <label 
                    htmlFor="name block" 
                    className="text-white font-semibold mb-1"
                    >
                    Price
                    </label>
                    <input 
                    type="number" 
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    />
                </div>

                {/* Quantity section */}
                <div className="flex flex-col mb-3 w-[48%]">
                    <label 
                    htmlFor="name block" 
                    className="text-white font-semibold mb-1"
                    >
                    Quantity
                    </label>
                    <input 
                    type="number" 
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    />
                </div>

                {/* Brand Section */}
                <div className="flex flex-col mb-3 w-[48%]">
                    <label 
                    htmlFor="name block" 
                    className="text-white font-semibold mb-1"
                    >
                    Brand
                    </label>
                    <input 
                    type="text" 
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    />
                </div>
                </div>

                <label htmlFor="" className="my-5">
                Description
                </label>
                <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="flex justify-between">
                <div>
                    <label htmlFor="name block">Count In Stock</label> <br />
                    <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                </div>

                <div>
                    <label htmlFor="">Category</label> <br />

                    <select 
                        placeholder="Select Category" 
                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>

                        {/* Safely map categories */}
                        {categories && categories.length > 0 ? (

                        categories.map((c) => (
                            <option key={c._id} value={c._id}>
                            {c.name}
                            </option>
                        ))
                        ) : (

                        <option disabled>Loading categories...</option>
                        )}
                    </select>
                </div>
                        
                    <button
                    onClick={handleSubmit}
                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
                    >

                        Update
                    </button>

                    <button
                    onClick={handleDelete}
                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
                    >

                        Delete
                    </button>

                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductUpdate