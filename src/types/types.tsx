import { ChangeEvent } from "react"

export type TrackType = {
  artist: string
  albumArt: string
  uri: string
  name: string
  id: string
}

export type AlbumImageType = {
  height: number
  url: string
  width: number
}

export type PlaylistComponentType = {
  playlist: TrackType[] 
  deleteTrack: (id: string) => void 
  clearPlaylist: () => void 
  makePlaylist: (playlistName: string) => void 
  selectTrackToPlay: (track: TrackType) => void 
  playWholePlaylist: () => void 
  togglePlayBtn: TrackType | TrackType[] | null
}

export type TrackComponentType = { 
  song: TrackType
  togglePlayBtn: TrackType | TrackType[] | null 
}


export type SearchBarComponentType = { 
  query: string
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void 
}

export type SearchResultsComponentType = { 
  searchResults: TrackType[]
  addTrack: (id: string) => void
  selectTrackToPlay: (track: TrackType) => void
  togglePlayBtn: TrackType | TrackType[]  | null 
}

export type SongPlayerComponentType = {
  accessToken: string,
  trackUri: string[] | string
}