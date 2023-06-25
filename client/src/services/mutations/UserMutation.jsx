import { gql } from "@apollo/client"
const ADD_USER = gql`
    mutation addUser($name: String, $email: String, $password: String, $photo: Upload, $position: String ) {
        addUser(name: $name, email: $email, password: $password, photo: $photo, position: $position) {
            id
            name
            email
            photo
            position
            updatedAt
        }
    }
`

const UPDATE_USER = gql`
    mutation updateUser($id: ID, $name: String, $email: String, $password: String, $photo: Upload, $position: String ) {
        updateUser(id: $id, name: $name, email: $email, password: $password, photo: $photo, position: $position) {
            id
        }
    }
`

const DELETE_USER = gql`
    mutation deleteUser($id: ID, $publicId: String) {
        deleteUser(id: $id, publicId: $publicId) {
            id
        }
    }
`

const SINGIN_USER = gql`
    mutation signInUser($id: ID, $password: String) {
        signInUser(id: $id, password: $password) {
            id
        }
    }
`

const DELETE_IMAGE = gql`
    mutation deleteImage($publicId: String) {
        deleteImage(publicId: $publicId) {
            publicId
        }
    }    
`

export { ADD_USER, UPDATE_USER, DELETE_USER, SINGIN_USER, DELETE_IMAGE }