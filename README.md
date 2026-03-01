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


# Github Action CI-CD
Excellent Suraj 🔥🔥
Now you are thinking like a real DevOps engineer.

Your requirement:

✅ Push code to `main`
✅ Build frontend, backend, database images
✅ Push to Docker Hub
✅ Update image tags inside `k8s-manifests`
✅ Commit updated YAML back to repo

Perfect CI/CD flow 👌

---

# 🏗 Assumed Project Structure

```
repo/
 ├── frontend/
 │    └── Dockerfile
 ├── backend/
 │    └── Dockerfile
 ├── database/
 │    └── Dockerfile
 ├── k8s-manifests/
 │    ├── frontend-deployment.yaml
 │    ├── backend-deployment.yaml
 │    └── mongo-deployment.yaml
```

---

# 🔐 STEP 1 — Required GitHub Secrets

Go to:

GitHub Repo → Settings → Secrets → Actions → New Repository Secret

Add:

```
DOCKER_USERNAME
DOCKER_PASSWORD
```

Example:

* DOCKER_USERNAME = surajmane121045
* DOCKER_PASSWORD = your_dockerhub_password_or_token

⚠️ Use Docker Hub Access Token (recommended)

---

# 🚀 STEP 2 — Create GitHub Action Workflow

Create file:

```
.github/workflows/ci-cd.yaml
```

---

# ✅ GitHub Actions Workflow File

```yaml
name: Three Tier CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set Image Tag
      run: echo "IMAGE_TAG=${{ github.sha }}" >> $GITHUB_ENV

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    # ---------------- FRONTEND ----------------
    - name: Build Frontend Image
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/three-tier-app-frontend:${IMAGE_TAG} ./frontend
        docker push ${{ secrets.DOCKER_USERNAME }}/three-tier-app-frontend:${IMAGE_TAG}

    # ---------------- BACKEND ----------------
    - name: Build Backend Image
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/three-tier-app-backend:${IMAGE_TAG} ./backend
        docker push ${{ secrets.DOCKER_USERNAME }}/three-tier-app-backend:${IMAGE_TAG}

    # ---------------- DATABASE ----------------
    - name: Build Database Image
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/three-tier-app-mongodb:${IMAGE_TAG} ./database
        docker push ${{ secrets.DOCKER_USERNAME }}/three-tier-app-mongodb:${IMAGE_TAG}

    # ---------------- UPDATE K8S MANIFESTS ----------------
    - name: Update Kubernetes Manifests
      run: |
        sed -i "s|three-tier-app-frontend:.*|three-tier-app-frontend:${IMAGE_TAG}|g" k8s-manifests/frontend-deployment.yaml
        sed -i "s|three-tier-app-backend:.*|three-tier-app-backend:${IMAGE_TAG}|g" k8s-manifests/backend-deployment.yaml
        sed -i "s|three-tier-app-mongodb:.*|three-tier-app-mongodb:${IMAGE_TAG}|g" k8s-manifests/mongo-deployment.yaml

    - name: Commit Updated Manifests
      run: |
        git config --global user.name "github-actions"
        git config --global user.email "actions@github.com"
        git add .
        git commit -m "Update image tags to ${IMAGE_TAG}" || echo "No changes to commit"
        git push
```

---

# 🧠 How This Works

When you push to main:

1. GitHub runner starts
2. Builds 3 Docker images
3. Tags with commit SHA
4. Pushes to Docker Hub
5. Updates image tag in k8s YAML
6. Commits changes back to repo

---

# 🏆 Important Requirement In Your Deployment YAML

Your image line must look like this:

```yaml
image: surajmane121045/three-tier-app-frontend:latest
```

Because `sed` replaces the tag part.

---

# 🔥 Best Practice (Optional But Pro Level)

Instead of using `sed`, you should use:

* Kustomize
* Helm
* Or separate GitOps repo (ArgoCD best practice)

In real companies:

* App repo
* Deployment repo (separate)

---




