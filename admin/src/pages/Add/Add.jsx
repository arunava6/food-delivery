import React from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setdata] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  })

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event)=>{
      event.preventDefault();
      const formData= new FormData();
      formData.append("name",data.name)
      formData.append("description",data.description)
      formData.append("price",Number(data.price))
      formData.append("category",data.category)
      formData.append("image",image)
      const response = await axios.post(`${url}/api/food/add`,formData);
      if(response.data.success){
        setdata({
          name: "",
          description: "",
          price: "",
          category: ""
        })
        setImage(false)
        toast.success(response.data.message)
      }
      else{
        toast.error(response.data.message)
      }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <b>Upload Image</b>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChnageHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChnageHandler} value={data.description} name="description" rows="6" placeholder='write content here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChnageHandler} value={data.category} name="category" >
              <option value="" disabled selected>Select a category</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Main course">Main course</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChnageHandler} value={data.price} type="Number" name='price' placeholder='Rs.20' />
          </div>
        </div>
        <button type='submit' className='add-btn'> Add</button>
      </form>
    </div>
  )
}

export default Add
