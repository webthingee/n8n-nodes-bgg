FROM n8nio/n8n

# Switch to root to install the node
USER root

# Install TypeScript and required type dependencies globally
RUN npm install -g typescript @types/jest @types/xml2js

# Copy the node package
COPY . /tmp/n8n-nodes-bgg

# Install and build the node
RUN cd /tmp/n8n-nodes-bgg && \
    npm install && \
    npm install --save-dev @types/jest @types/xml2js && \
    npm install n8n-workflow n8n-core && \
    npm run build && \
    mkdir -p /home/node/.n8n/custom && \
    cp -r /tmp/n8n-nodes-bgg /home/node/.n8n/custom/ && \
    chown -R node:node /home/node/.n8n/custom

# Switch back to node user
USER node

# Set the custom extensions path
ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom 