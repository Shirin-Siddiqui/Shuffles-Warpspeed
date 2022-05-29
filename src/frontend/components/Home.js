import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import './home.css';
import LandingPage from "./LandingPage"

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)

        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        console.log(metadata)
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          ownership:metadata.ownershipp,
          tires:metadata.tiress,
          totalTokens:1000,

          tokenBasic:metadata.tokenBasic,          
          tokenStandard: metadata.tokenStandard,
          tokenPremium: metadata.tokenPremium,
          standardPrice: metadata.standardPrice,
          premiumPrice: metadata.premiumPrice,
          tokenInfluencersFraction: metadata.tokenInfluencersFraction,
          tokenStandardFraction: (metadata.ownershipp / 3) / metadata.tokenStandard,
          tokenBasicFraction: (metadata.ownershipp / 3) / metadata.tokenBasic,
          tokenPremiumFraction: (metadata.ownershipp / 3) / metadata.tokenPremium,
          image: decodeURI(metadata.image.trim())
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div>
    <LandingPage />
    <div className='featured-text'>
      Buy Featured Drops
    </div>
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={"https://ipfs.infura.io/ipfs/" + item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text class="item-desc">
                      {item.description}
                    </Card.Text>
                    <Card.Text>
                      {"Ownership Offered: " + item.ownership}
                    </Card.Text>
                    <Card.Text>
                      {"Total Tokens: " + 1000}
                    </Card.Text>
                    <Card.Text>
                      {"Basic Tokens: " + item.tokenBasic}
                    </Card.Text>
                    <Card.Text>
                    {"Basic Fraction: " + item.tokenBasicFraction.toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                      {"Standard Tokens: " + item.tokenStandard}
                    </Card.Text>
                    <Card.Text>
                    {"Standard Fraction: " + item.tokenStandardFraction.toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                      {"Premium Tokens: " + item.tokenPremium}
                    </Card.Text>
                    <Card.Text>
                    {"Premium Fraction: " + item.tokenPremiumFraction.toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                    {"Tokens offered to influencers: " + item.tokenInfluencersFraction}
                    </Card.Text>
                    
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button className = "button-styles" onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy Basic for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                      <Button className = "button-styles" onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy Standard for {item.standardPrice} ETH
                      </Button>
                      <Button className = "button-styles" onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy Premium for {item.premiumPrice} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
    </div>
  );
}
export default Home