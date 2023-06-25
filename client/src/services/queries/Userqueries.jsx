import { gql } from "@apollo/client";
const USERS = gql`
    query users {
        users {
            id
            name
            email
            photo
            position
            publicId
            updatedAt
        }
    }
`

const USER = gql`
    query user($id: ID!) {
        user(id: $id) {
            id
            name
            email
            photo
            position
            publicId
            updatedAt
        }
    }
`

export { USERS, USER };
