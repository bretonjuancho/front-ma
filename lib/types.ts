export interface Licencia {
  id: string
  tipo: string
  observaciones: string
  fechaCreacion: Date
}

export interface Titular {
  tipoDocumento: string
  documento: string
  nombre: string
  apellido: string
  fechaNacimiento: Date | undefined
  direccion: string
  grupoSanguineo: string
  factorRH: string
  donanteOrganos: boolean
  licencias: Licencia[]
}

export interface LicenciaConTitular {
  id: string
  tipo: string
  observaciones: string
  fechaEmision: Date
  fechaVencimiento: Date
  titular: {
    tipoDocumento: string
    documento: string
    nombre: string
    apellido: string
    fechaNacimiento: Date | undefined
    direccion: string
    grupoSanguineo: string
    factorRH: string
    donanteOrganos: boolean
    licencias: Licencia[]
  }
}