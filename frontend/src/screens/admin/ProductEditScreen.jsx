import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductEditScreen = () => {
    const {id: productId}=useParams();

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [name, setName]=useState('');
    const [image, setImage]=useState('');
    const [price, setPrice]=useState(0);
    const [brand, setBrand]=useState('');
    const [category, setCategory]=useState('');
    const [countInStock, setCountInStock]=useState(0);
    const [description, setDescription]=useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [updateProduct,{isLoading:loadingUpdate}]=useUpdateProductMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            await updateProduct({
                productId,
                name,
                image,
                price,
                brand,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Product updated!');
            refetch();
            navigate('/admin/productlist');
        }catch(err){
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(()=>{
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setIsLoadingData(false);
        }
    },[product]);

  return (
    
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error.data.message}</Message>
            ) : (
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                            type='number'
                            placeholder='Enter Price'
                            value={price}
                            onChange={(e)=> setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Enter Brand'
                            value={brand}
                            onChange={(e)=> setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='coundInStock'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control 
                            type='number'
                            placeholder='Enter Count In Stock'
                            value={countInStock}
                            onChange={(e)=> setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Enter Category'
                            value={category}
                            onChange={(e)=> setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Enter Description'
                            value={description}
                            onChange={(e)=> setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button
                        type='submit'
                        variant='primary'
                        style={{marginTop: '1rem'}}
                    >
                        Update 
                    </Button>
                    
                </Form>
            )}
        </FormContainer>
    </>
  );
};

export default ProductEditScreen