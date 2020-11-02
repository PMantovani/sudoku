FROM node AS builder

RUN npm install -g @angular/cli

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN ng build --prod

FROM nginx AS runner

# Copy distribution files to nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html/
