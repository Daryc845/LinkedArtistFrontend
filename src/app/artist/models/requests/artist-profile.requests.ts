// models/requests/artist-profile.requests.ts

/**
 * NOTA: Los endpoints GET no requieren body en el request,
 * solo el ID en la URL. Estas interfaces se crean para mantener
 * consistencia en la arquitectura, pero no se usan en el POST body.
 */

/**
 * Request para obtener información del artista (implícito en URL)
 * Endpoint: GET /user/{id}/all
 * El ID se obtiene de la URL /artist/{id}
 */
export interface GetArtistRequest {
  userid: number; // Se usa solo para construir la URL
}

/**
 * Request para obtener información de un proyecto (implícito en URL)
 * Endpoint: GET /projects/{id}/bgetinfo
 * Se usa cuando se presiona sobre un proyecto
 */
export interface GetProjectInfoRequest {
  projectid: number; // Se usa solo para construir la URL
}