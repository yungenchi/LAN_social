# Project name
LAN (Loop Agile Now)

# Project description
This is a in-company communicate social media application.

## Team details
- Yung-En Chi (https://github.com/s3864916)
- Zico Zhong (https://github.com/ZhihaoZhong-s3756809)

## Project Structure
The project has User-end and Admin-end, both runs in different FrontEnd & BackEnd of directory.
- User
    - FrontEnd: User_FrontEnd
    - BackEnd: User_BackEnd
- Admin
    - FrontEnd: Admin_FrontEnd
    - BackEnd: Admin_BackEnd

For user part, using functional react as front-end, connecting to backend using REST; for the back-end using sqlize with sql database fetch with REST.
For admin part, using functional react as front-end, connecting to backend using GraphQL; for the back-end using sqlize with sql database fetch with GraphQL.

## Project Configure & run
- For configure & run front end (both user & admin) go to the according FrontEnd directory, then:
> npm install
> node start

- For configure & run back end (both user & admin) go to the according BackEnd directory, then:
> npm install
> node server.js

## External Package Used
- **bootstrap**
  - install: npm install bootstrap
  - version: _^5.2.2_
  - description: For building user interface.
 
## References
- This is originally the assignment for RMIT - Full Stack Development COSC2758.
- The code was using week8 tutorial code as starting code (https://rmit.instructure.com/courses/90493/files/27052011?wrap=1)
