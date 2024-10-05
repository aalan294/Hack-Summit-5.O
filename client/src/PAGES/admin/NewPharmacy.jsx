import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { pinata } from '../../config';
import api from '../../API/api';
import { abi } from '../../abi';

// Styled Components for blue and white theme
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const FormWrapper = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Title = styled.h2`
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
  grid-column: span 3;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  grid-column: span 3;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  grid-column: span 3;
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  grid-column: span 3;
  color: green;
  text-align: center;
`;

const NewPharmacy = () => {
  const contractAddress = '0x2Ea64dAc8cd5E51E75c3273C2F8C152218002cE5'; // Change to the correct address
  const [pharmacyData, setPharmacyData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    wallet: '',
    verification: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPharmacyData({ ...pharmacyData, [name]: value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const response = await pinata.upload.file(selectedFile);
      const cid = response.cid;
      setPharmacyData({ ...pharmacyData, verification: cid });
      console.log('CID:', cid);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Step 1: Register pharmacy in the backend
      const response = await api.post('/admin/reg-pharm', pharmacyData);

      if (response.data.status) {
        const { id } = response.data;
        console.log('Pharmacy ID:', id);

        // Step 2: Call smart contract function
        await registerPharmacyOnBlockchain(id, pharmacyData);

        setSuccess('Pharmacy registered successfully!');
        setPharmacyData({
          name: '',
          owner: '',
          email: '',
          phone: '',
          address: '',
          wallet: '',
          verification: ''
        });

        // Redirect to dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error occurred while registering the pharmacy');
      console.error('Error:', error);
    }
  };

  const registerPharmacyOnBlockchain = async (pharmacyId, pharmacyData) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(abi, contractAddress);

      await contract.methods
        .registerUser(
          pharmacyData.wallet, 
          pharmacyId, 
          pharmacyData.verification, 
          0 // Role.Pharmacy enum is 0
        )
        .send({ from: accounts[0] });

      console.log('Pharmacy registered on blockchain successfully!');
      alert("Pharmacy registered successfully on blockchain!");
    } catch (error) {
      alert(`${error.message}`)
      setError('Error occurred while registering the pharmacy on the blockchain');
      console.error('Blockchain Error:', error);
    }
  };

  return (
    <FormContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>Register Pharmacy</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <InputGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={pharmacyData.name}
            onChange={handleInputChange}
            placeholder="Enter pharmacy name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Owner</Label>
          <Input
            type="text"
            name="owner"
            value={pharmacyData.owner}
            onChange={handleInputChange}
            placeholder="Enter owner's name"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={pharmacyData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={pharmacyData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Address</Label>
          <Input
            type="text"
            name="address"
            value={pharmacyData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Wallet Address</Label>
          <Input
            type="text"
            name="wallet"
            value={pharmacyData.wallet}
            onChange={handleInputChange}
            placeholder="Enter wallet address"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Verification Document (Pharmacy License, etc.)</Label>
          <Input type="file" onChange={handleFileChange} required />
          <Button type="button" onClick={handleFileUpload}>
            Upload to IPFS
          </Button>
        </InputGroup>

        <Button type="submit">Register Pharmacy</Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default NewPharmacy;
