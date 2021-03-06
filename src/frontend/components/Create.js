import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import './home.css';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setBasicPrice] = useState(null)
  const [name, setName] = useState('')
  const [tokenn, setToken] = useState(null)
  const [ownershipp, setOwnership] = useState(null)
  const [tiress, setTires] = useState(null)
  const [tokenBasic, setTokensBasic] = useState(null)
  const [tokenStandard, setTokensStandard] = useState(null)
  const [tokenPremium, setPremium] = useState(null)
  const [description, setDescription] = useState('')
  const [standardPrice, setStandardPrice] = useState(null)
  const [premiumPrice, setPremiumPrice] = useState(null)
  const [tokenInfluencersFraction, settokenInfluencersFraction] = useState(null)

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`
        ${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, price, name, description, tokenn ,ownershipp,tiress,tokenBasic,tokenStandard,tokenPremium, standardPrice, premiumPrice, tokenInfluencersFraction}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    //console.log(result.path)
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />

              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setBasicPrice(e.target.value)} size="lg" required type="number" placeholder="Basic Price in ETH" />
              <Form.Control onChange={(e) => setToken(e.target.tokens)} size="lg" required type="number" placeholder="Tokens Offered" />
              <Form.Control onChange={(e) => setOwnership(e.target.value)} size="lg" required type="number" placeholder="Ownership Offered" />
              <Form.Control onChange={(e) => setTires(e.target.value)} size="lg" required type="number" placeholder="Tires" />
              <Form.Control onChange={(e) => setTokensBasic(e.target.value)} size="lg" required type="number" placeholder="Basic Tokens" />
              <Form.Control onChange={(e) => setTokensStandard(e.target.value)} size="lg" required type="number" placeholder="Standard Tokens" />
              <Form.Control onChange={(e) => setPremium(e.target.value)} size="lg" required type="number" placeholder="Premium Tokens" />
              <Form.Control onChange={(e) => setStandardPrice(e.target.value)} size="lg" required type="number" placeholder="Standard Price in ETH" />
              <Form.Control onChange={(e) => setPremiumPrice(e.target.value)} size="lg" required type="number" placeholder="Premium Price in ETH" />
              <Form.Control onChange={(e) => settokenInfluencersFraction(e.target.value)} size="lg" required type="number" placeholder="Tokens for Influencers" />

              <div className="d-grid px-0">
                <Button className = "button-styles"onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create