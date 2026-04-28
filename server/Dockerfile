FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose port (Cloud Run requires this)
EXPOSE 8080

# Start server
CMD ["node", "app.js"]
