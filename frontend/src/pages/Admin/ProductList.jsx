import { useNavigate } from "react-router"
import { useState } from "react"

import { toast } from "react-toastify"

import { useCreateProductMutation, useUploadProductImageMutation } from "../../redux/api/productApiSlice"

//fetching all the categories
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice"
import AdminMenu from "./AdminMenu"


const ProductList = () => {

    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState(0)
    const [imageURL, setImageURL] = useState(null)

    const navigate = useNavigate()

    const [createProduct] = useCreateProductMutation()
    const [uploadProductImage] = useUploadProductImageMutation()
    const {data: categories} = useFetchCategoriesQuery()

    const uploadFileHandler = async(e) => {

                            //inbuilt Function
        const formData = new FormData()
        formData.append('image', e.target.files[0])

        try 
        {
        
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message)
            setImage(res.image)
            setImageURL(res.image)

        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }

    }

    const handleSubmit = async(e) => {
        e.preventDefault();
    
        try {
            const productData = new FormData();
            
            productData.append('image', image);
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('category', category);
            productData.append('quantity', quantity);
            productData.append('brand', brand);
            productData.append('countInStock', stock);
    
            const { data } = await createProduct(productData)

            if(!data)
            {
                toast.error("product create failed")
            }
            else{

                toast.success(`${data.name} is created`)
                navigate('/')
            }

        }catch(error)
        {
            console.error(error)
            toast.error("Product creation failed")
        }

    };

   
  return (

    
    //CG
    <div className="container xl:mx-[9-rem] sm:mx-[0] pl-16">
        <div className="flex flex-col md:flex-row">

            {/* Admin Menu */}
            <AdminMenu/>

            <div className="md:w-3/4 p-3">
            <div className="h-12">Create Product</div>

            {/* if we have imageURL render the content in (), if we don't, don't need to render at all */}
            {imageURL && (
                <div className="text-center">
                <img 
                    src={imageURL} 
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
                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
                    >

                        Submit
                    </button>

                </div>
            </div>
        </div>
    </div>



    
  )
}

export default ProductList

