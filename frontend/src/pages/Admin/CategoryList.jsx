import { toast } from "react-toastify"

import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery
} from '../../redux/api/categoryApiSlice';

import { useState } from "react";

import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {

    //fetch all the categories
    const {data: categories, refetch} = useFetchCategoriesQuery()
    // console.log(categories);
    

    const [name, setName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [updatingName, setupdatingName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    
    const [createCategory] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()

    const handleCreateCategory = async(e) => {

        e.preventDefault()

        if(!name)
        {
            toast.error("Category Name is Required")
            return
        }

        try 
        {
        
            const result = await createCategory({name}).unwrap()
            if(result.error)
            {
                toast.error(result.error)
            }else{

                setName("")
                toast.success(`${result.name} Successfully Created.`)

                refetch();
            }

        } catch (error) {
            console.error(error)
            toast.error("Creating Category Failed.")
        }
    }

    const handleUpdateCategory = async(e) => {

        e.preventDefault()

        if(!updatingName)
        {
            toast.error("Updated Name is Required")
            return;
        }

        // Ensure the name has actually changed
        if (selectedCategory.name === updatingName) {
            toast.info("No changes made as Update.");
            return;
        }

        try
        {
        
            const result = await updateCategory({
                categoryId: selectedCategory._id,
                updatedCategory: { 
                    name: updatingName,
                },
            }).unwrap();

            if(result.error)
            {
                toast.error(result.error);
                
            }
            else{
                toast.success(`${result.name} is Updated.`)
                setSelectedCategory(null)
                setupdatingName("")
                setModalVisible(false)

                refetch();
                
            }

        } catch (error) {
            console.error(error);
            toast.error("handleUpdateCategory Update Failed")
            
        }
    }

    const handleDeleteCategory = async() => {
        
        try 
        {
        
            const result = await deleteCategory(selectedCategory._id).unwrap();

            if(result.error)
            {
                toast.error(result.error)
            }
            else
            {
                toast.success(`${result.name} Deleted Successfully.`)
                setSelectedCategory(null)
                setModalVisible(false)

                // Refetch the categories to update the list
                refetch();
            }

        } catch (error) {
            console.error(error)
            toast.error("handleDeleteCategory Delete Failed.")
        }
    }

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">

        <AdminMenu/>

        <div className="md:w-3/4 p-3">
        
            <div className="h-12">
                Manage Category
            </div>

            <CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory}/>
            <br />
            <hr />

            {/* Rendering all the Categories */}
            <div className="flex flex-wrap">
                
                {categories?.map((category) => (

                    // key should be specified in map function

                    <div key={category._id}>

                        <button 
                        className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3
                        hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                        
                        onClick={() => {{

                            setModalVisible(true)
                            setSelectedCategory(category)
                            setupdatingName(category.name)
                        }}}
                        >
                            {category.name}
                        </button>
                    </div>

                    
                ))}

            </div>

                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>

                    <CategoryForm 
                    value={updatingName} 
                    setValue={(value) => setupdatingName(value)}
                    handleSubmit={handleUpdateCategory}
                    handleDelete={handleDeleteCategory}
                    buttonText="Update"
                    />
                </Modal>

        </div>
    </div>
  )
}

export default CategoryList