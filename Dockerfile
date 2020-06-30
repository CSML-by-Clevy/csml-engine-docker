FROM node:lts as build

RUN apt-get update
RUN apt-get upgrade -y

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.44.0

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain ${RUST_VERSION} && \
    rustup install ${RUST_VERSION} && \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

WORKDIR /usr/src/app

COPY csml csml
COPY package*.json ./

RUN npm i -g neon-cli
RUN neon build -p csml/bindings/node --release

FROM node:12 as run

WORKDIR /usr/src/app

RUN mkdir -p ./native
COPY --from=0 /usr/src/app/csml/bindings/node/native/index.node ./native/index.node

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]

