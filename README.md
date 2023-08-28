# The Eras Tour Surprise Song Bingo Backend

This is the backend part of the The Eras Tour Surprise Song Bingo project, responsible for managing data and providing APIs for the frontend.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Tech Used](#tech-used)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (v16.13 or higher)
- npm or yarn
- MySQL or your preferred database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/h-fcosta/bingo-eras-tour-backend.git
cd bingo-eras-tour-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure the enviroment variables:

```plaintext
SPOTIFY_API_ID
SPOTIFY_CLIENT_SECRET
DATABASE_URL
REDIS_URL
```

4. Run the database migrations:

```bash
npx prisma migrate deploy
```

5. Start server:

```bash
npm start
```

### Tech Used

- Node.js
- TypeScript
- Axios
- Express
- Prisma
- PostgreSQL

### Usage

The backend uses the Spotify and Deezer APIs to get a list of albums, singles and album tracks, and store in the database.

Recommended to use a SQL database, since there are relations between tables like Album and Song, Song and Links. 

Redis is used to store the access token while fetching the data from the Spotify API.

### Endpoints

`GET /token`: Request to GET Authorization Token to access Spotify API.

`GET /spotify/albums/:artistId`: Get a list of the artist's albums from Spotify, and insert in the data in the database.
Limit: 30 albuns per artist

`GET /spotify/singles/:artistId`: Get a list of the artist's singles from Spotify,, and insert in the data in the database.
Limit: 30 albuns per artist

`GET /spotify/songs/:albumId`: Get a list of the album tracks from Spotify, and insert the data in the database.

`GET /deezer/albums/:artistId`: Get a list of the artist's albums from Deezer, and insert in the data in the database the ID and the link.

`GET /deezer/singles/:artistId`: Get a list of the artist's singles from Deezer, and insert in the data in the database the ID and the link.

`GET /deezer/songs/:albumId`: Get a list of the album tracks from Deezer, and insert the data in the database the ID and the link.

`GET /songs`: Get a list of all songs and singles with the streaming services links and others informations from the database.

### Contact

For any questions and suggestions, feel free to contact me at [henriquefcosta19@gmail.com]

### License

This project is licensed under the MIT License - see the LICENSE file for details.
