import { gql } from "@apollo/client";
const GET_PROJECTS = gql`
    query getProjects {
        projects {
            id
            title
            description
            languages
            image
            publicId
            status
            members {
                id
                name
                photo
            } 
            tasks {
                id
                name
                isDone
                user {
                    id
                    name
                    photo
                }
            }
        }
    }
`

const PROJECT = gql`
    query Project($id: ID!) {
        project(id: $id) {
            id
            title
            description
            languages
            image
            publicId
            status
            members {
                id
                name
                photo
            } 
            tasks {
                id
                name
                isDone
                user {
                    id
                    name
                    photo
                }
            }
        }
    }
`

export { GET_PROJECTS, PROJECT };
