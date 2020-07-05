# CryptoPunk
[CryptoPunks](https://www.larvalabs.com/cryptopunks) is a well-known auction website for buying and selling “CryptoPunks” - a series of unique collectable characters that can be purchased over the Ethereum main network. There are 10,000 different CryptoPunks that have various different styles, including hair colour and accessories.

## Assignment Requirements:
In this challenge, you will build an HTTP API to display information about CryptoPunks. Your goal is to expose two endpoints that:
1. Return a list of all the punks that are listed for sale.
2. Return the for-sale price and information about a single punk, given its numeric identifier.

NOTE: The CryptoPunks smart contract and ABI exists at `0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb`

## Steps to set-up and start:
npm install  
npm run start

## CryptoPunk APIs:

### 1. Listing all punks (by punkIndex) available for sale 

    GET /punks-for-sale


### 2. Listing all info about a punk given it's punkIndex

    GET /punk-info/punkIndex 

    eg. /punk-info/323
