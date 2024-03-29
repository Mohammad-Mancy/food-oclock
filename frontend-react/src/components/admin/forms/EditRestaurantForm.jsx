import React, { useState,useEffect }  from 'react'
import { useLocation,Link,useNavigate } from 'react-router-dom';
import AdminTopNavBar from '../../navbar/AdminTopNavBar';
import { reactLocalStorage } from 'reactjs-localstorage';
import imageIcon from '../../../assets/Images-icon.png'
import Select from 'react-select'
import Map from '../../main/Map'
import Form from 'react-bootstrap/Form';

const EditRestaurantForm = () => {

  const user_type = reactLocalStorage.getObject('user').type;
  const token_key = reactLocalStorage.get('token_key');
  const location = useLocation();
  const [options,setOptions] = useState([]);
  const [name,setName] = useState()
  const [capacity,setCapacity] = useState()
  const [description,setDescription] = useState()
  const [collection,setCollection] = useState()
  const [trend,setTrend] = useState()
  const [email,setEmail] = useState()
  const [phone_number,setPhone_number] = useState()
  const [imageName,setImageName] = useState('')
  const [location_name,setLocation_name] = useState()
  const [base64code,setBase64code] = useState('noChange')
  const [editNotification,setEditNotification] = useState(false)
  const navigation = useNavigate()

  let handleCallCurrentRestaurant = async (e) => {
    try{
      let res = await fetch(`http://127.0.0.1:8000/api/v1/auth/restaurant/get-restaurants/${location.state.id}`,{
        method:'GET',
        headers:{'Content-Type' : 'application/json'}
      })
      const data = await res.json();
      if (res.status === 200 ){
        setName(data.restaurants.name)
        setImageName(data.restaurants.image)
        setCapacity(data.restaurants.capacity)
        setDescription(data.restaurants.description)
        setCollection(data.restaurants.collection)
        setTrend(data.restaurants.trend)
        setEmail(data.restaurants.email)
        setPhone_number(data.restaurants.phone_number)
        setLocation_name(data.restaurants.location_name)
        reactLocalStorage.set('lat-coordinates',data.restaurants.latitude)
        reactLocalStorage.set('lng-coordinates',data.restaurants.longitude)
        reactLocalStorage.set('coordinateLat',data.restaurants.latitude)
        reactLocalStorage.set('coordinateLng',data.restaurants.longitude)
      }
    }catch(error){
      console.error(error)
    }
  }

  let handleCallCollection = async (e) => {
    try{
      let res = await fetch('http://127.0.0.1:8000/api/v1/auth/restaurant/get-collections',{
        method:'GET',
        headers:{'Content-Type' : 'application/json'}
      })
      const data = await res.json();
      if (res.status === 200 ){
        data.collections.map(({id,name})=>{
          setOptions((options) => [...options,{'value':id,'label':name}])
        })
      }
    }catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    handleCallCurrentRestaurant();
    handleCallCollection();
  }, [])

  const imageChoice = (e) => {
    const files = e.target.files;
    const file = files[0];
    getBase64(file);
  }
  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    setImageName(file.name)
    reader.onload = () => {
      onLoad(reader.result);
    }
  }
  const onLoad = (fileString) => {
    setBase64code(fileString)
    console.log(base64code)
  }

  const handleSaveRestaurant = async (e) => {
    e.preventDefault()
    try{
      let res = await fetch('http://127.0.0.1:8000/api/v1/auth/admin/update-restaurant',{
        method:'PUT',
        headers:{
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token_key}`
        },
        body: JSON.stringify({
          id:location.state.id,
          name:name,
          image:base64code,
          type:user_type,
          description:description,
          capacity:capacity,
          collection:collection,
          trend:trend,
          email:email,
          phone_number:phone_number,
          city:location_name,
          longitude:reactLocalStorage.get('coordinateLng'),
          latitude:reactLocalStorage.get('coordinateLat')
        })
      })
      if (res.status === 204 ){
        setEditNotification(true)
      }
    }catch(error){
      console.error(error)
    }
  }
  if(imageName === ''){
    return(
      <>Still loading...</>
    )
  }
  return (
    <div className="edit-restaurant-container">
      <AdminTopNavBar status={'form-col-rest'}/>
      <div className="edit-rest-title">Edit Restaurant with ID: {location.state.id}</div>
      <form 
        className='restaurant-form'
        onSubmit={(e) => {
          handleSaveRestaurant(e)
          setTimeout(() => {
            setEditNotification(false)
            navigation('/manageRestaurant')
          }, 2000)
        }}
        >
        <input type="file" onChange={imageChoice} className="input-file-image" id='image-input'/>
        <label htmlFor="image-input" className='image-input-label'>
        {base64code === 'noChange' ?
          <img src={'http://127.0.0.1:8000/app/public/'+imageName} style={{width:'500px',height:'350px'}}/>
        :
          <img src={base64code} style={{width:'500px',height:'350px'}}/>
        }
          <span>{imageName}</span>
        </label>
        <label>
            <p>Name</p>
            <input type="text" 
            placeholder={name}
            onChange={ (e) => setName(e.target.value)}
            />
        </label>
        <label>
            <p>Description</p>
            <textarea type="text" 
            placeholder={description}
            onChange={ (e) => setDescription(e.target.value)}
            />
        </label>
        <label>
            <p>Capacity</p>
            <input type="text" 
            placeholder={capacity}
            onChange={ (e) => setCapacity(e.target.value)}
            />
        </label>
        <label>
            <p>Email</p>
            <input type="text" 
            placeholder={email}
            onChange={ (e) => setEmail(e.target.value)}
            />
        </label>
        <label>
            <p>Phone Number</p>
            <input type="text" 
            placeholder={phone_number}
            onChange={ (e) => setPhone_number(e.target.value)}
            />
        </label>
        <label>
            <p>City</p>
            <input type="text" 
            placeholder={location_name}
            onChange={ (e) => setLocation_name(e.target.value)}
            />
        </label>
        <div className='map-wrapper'>
          <span>Location</span>
          <Map latLngg={false}/>
        </div>
        <div style={{width:'500px',marginBottom:'20px',marginTop:'20px'}}>
          <p style={{textAlign:'start'}}>Cuisine</p>
          <Select options={options} onChange={(e) => setCollection(e.value)}/>  
        </div>
        <Form.Check 
          className='check-trend'
          type="switch"
          id="custom-switch"
          label="Trend this week"
          defaultChecked={trend}
          onChange={ () => {trend === 1 ?setTrend(0):setTrend(1)}}
        />
        {editNotification &&
        <div><h5 style={{color:'green'}}>The Restaurant has been updated</h5></div>}
        <div className='edit-restaurant-btn-div'>
            <Link to="/manageRestaurant"><button type="submit" className='cancel-edit-restaurant'>Cancel</button></Link>
            <button type="submit" className='save-edit-restaurant'>Save</button>
        </div>
        </form>
    </div>
  )
}

export default EditRestaurantForm