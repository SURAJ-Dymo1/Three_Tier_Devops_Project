# Three_Tier_Devops_Project
Practice Project

# Create Mongodb Image
`
docker build -t surajmane121045/three_tier_app_mongodb:1.1 .

`

# Create Mongodb container with offcial latest mongo 7 image
`
docker run -d \
  --name three_tier_app_mongo \
  --network three_tier_app_network \
  -v three_tier_app_volume:/data/db \
  surajmane121045/three_tier_app_mongodb:1.1
`

# Create Backend image
`
docker build -t surajmane121045/three_tier_app_backend:1.3 .
`

# Create Backend container
docker run -d \
  --name three_tier_app_backend \
  --network  three_tier_app_network \
  -p 8082:8082 \
  -e MONGO_URI="mongodb://three_tier_app_mongo:27017" \
  surajmane121045/three_tier_app_backend:1.3

# Create Fronte Image
docker build -t surajmane121045/three_tier_app_frontend:1.3 .

# Create Frontend container
docker run -d \
  --network  three_tier_app_network \
  -p 3000:80 \
  --name three_tier_app_frontend  \
  surajmane121045/three_tier_app_frontend:1.3 

