# Project Name - Team Management App

Implementation of a GraphQl project with Node.Js for managing team members.

# Author - Adeola Victor Banjo (banjoadeola17@gmail.com)

# Framework and Technologies
- Node.js
- GraphQl
- Apollo-server
- Docker
- MongodDb

# Project Features
The project was implemented to manage Members and Tags. The operations that could be performed on tags and members include
- Create, Read, Update and Delete Members
- Create, Read, Update and Delete Tags
- Tags are created for members and when a tag is deleted, it is also pulled from the member profile.


The project runs on node.js, v14.15.0. Hence, you must have node.js (version 14 or higher) installed on your machine to run the application.

# Project Structure
The project is structured as follows
- Src Folder - Houses the other folders and files for the project implementation
    - Controllers - Call the validation and services functions, and direct them to the resolvers
    - Logger - Contain the winston logger set up for logging information and errors
    - Model - Contain the database models
    - Services - Contain the actual functions for the CRUD implementations for members and tags
    - Resolvers - House the functions that call the controller functions
    - Util - Contains the utilities in the application
    - Validations - validates the request bodies that is received
    - resolvers.js - Used for exporting the resolvers
    - schema.js - Houses the graphql schema definitions
- app.js - The index file that starts the graphql server and connects database
- Dockerfile - Contains the docker set up for the project

# Project set up
Clone the project from the Github repository https://github.com/banjoadeola17/team-management-app.git

Install dependencies - npm install

GraphQl server would have started with the followin message logged
Graphql Server ready at http://localhost:4000/

You can then access the URL "http://localhost:4000" on your browser to query the endpoints.

## Queries
# Tags

- Fetch details of a single tag

Request payload

query {
  tagById(tagId: "6104a60901e5436529cb5fad") {
    tagName
    tagDetails
  }
}

Response format

{
  "data": {
    "tagById": {
      "tagName": "Java",
      "tagDetails": "Employee responsible for java related issues"
    }
  }
}

-Fetch all tags

Request payload

query {
  getTags {
    tagName
    tagDetails
  }
}

Response format

{
  "data": {
    "getTags": [
      {
        "tagName": "Java",
        "tagDetails": "Employee in responsible for java related issues"
      },
      {
        "tagName": "Java",
        "tagDetails": "Employee responsible for java related issues"
      }
   }
}

# Members

## fetch a single member

query {
  memberById(memberId: "610348f91dbe35444ef1f3b1") {
    _id
  firstName
  lastName
  contractDuration
  role
  memberType
  tags {
    tagName
  }
  }
}

response
{
  "data": {
    "memberById": {
      "_id": "610347e31770714429c1a4fc",
      "firstName": "adeola",
      "lastName": "banjo",
      "contractDuration": 3,
      "role": null,
      "memberType": "CONTRACTOR",
      "tags": [
        {
          "tagName": "Java",
          "tagDetails": "Contractor responsible for java related cases."
        }
      ]
    }
  }
}

##fetch all members

Request body
query {
  getMembers {
  firstName
  lastName
  contractDuration
  role
  memberType
  tags {
    tagName
  }
  }
}

Response body
{
  "data": {
    "getMembers": [
        {
          "_id": "610347e31770714429c1a4fc",
          "firstName": "adeola",
          "lastName": "banjo",
          "contractDuration": 3,
          "role": null,
          "memberType": "CONTRACTOR",
          "tags": [
            {
              "tagName": "Java",
              "tagDetails": "Contractor responsible for java related cases."
            }
          ]
       }
    ]
  }
}


## Mutations

# Tags

- Create a tag

Request payload

mutation {
  createTag (memberId: "610347e31770714429c1a4fc", tagInput: {tagName: "Java", tagDetails: "Employee responsible for java related issues"}) {
    tagName
    tagDetails
  }
}

Response format

{
  "data": {
    "createTag": {
      "tagName": "Java",
      "tagDetails": "Employee responsible for java related issues"
    }
  }
}

- Update tag

Request payload

mutation {
  updateTag (tagId: "6105433f09db0e7215cd1202", tagInput: {tagName: "Golang", tagDetails: "Employee responsible for Go related cases."}) {
    tagName
    tagDetails
  }
}

Response format
{
  "data": {
    "updateTag": {
      "tagName": "Goland",
      "tagDetails": "Employee responsible for Go related cases"
    }
  }
}

- Delete tag

Request payload

mutation {
  deleteTag (tagId: "6105433f09db0e7215cd1202", memberId: "610347e31770714429c1a4fc")
  }
}

Response Format

{
  "data": {
    "deleteTag": {
      "status": true,
      "message": "Tag successfully removed."
    }
  }
}

# Members

- Create a member
mutation {
addMember(memberInput: {firstName: "adeola", lastName: "banjo", memberType: CONTRACTOR, role: "software engineer", contractDuration: 3}) {
  _id
  firstName
  lastName
  memberType
  role
  tags {
    tagName
  }
}
}

{
  "data": {
    "addMember": {
      "_id": "610347e31770714429c1a4fc",
      "firstName": "adeola",
      "lastName": "banjo",
      "memberType": "EMPLOYEE",
      "role": "software engineer",
      "tags": []
    }
  }
}


update member profile
mutation {
updateMemberProfile(memberId: "61034957e557df4459aa5ee5", memberInput: {firstName: "victor", lastName: "adeola", memberType: EMPLOYEE, role: "backend engineer", contractDuration: 3}) {
  _id
  firstName
  lastName
  memberType
  role
  tags {
    tagName
  }
}
}

{
  "data": {
    "updateMemberProfile": {
      "_id": "61034957e557df4459aa5ee5",
      "firstName": "victor",
      "lastName": "adeola",
      "memberType": "EMPLOYEE",
      "role": "backend engineer",
      "tags": []
    }
  }
}

- Delete member

Request payload

mutation {
deleteMember(memberId: "6103433619b2684380755814") {
  status
  message
}
}

Response format

{
  "data": {
    "deleteMember": {
      "status": true,
      "message": "Member successfully removed."
    }
  }
}


## FUTURE IMPROVEMENTS

The implementation considers the basic CRUD operation for members and tags. However, further improvements, 
if implemented would ensure a robust and a more effective team management managemnet.
The improvemement that could be considered include;

* Implementation of authentication and authorization (e.g with jwt and assigning roles to members) across the application. With this, only the authorized members can create/ set tags, 
delete tags and carry out other restrictive functions across the application.

* Write more of unit and integration tests cases to cover all the functions in the application.
This would help to properly track changes and breaks within the application.

* Implement soft deletion of members and tags such that when members are deleted or removed, their profiles are not totally removed from the database.

* A more robust error handling within the application to catch all errors that will be thrown at the point of usage.
