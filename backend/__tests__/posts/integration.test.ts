import request from "supertest";

describe('Post', () => {

    
    const AmplifyAppId = "d22q8c36bjteez"
    const ApiKeyId = "lux1zl2x1l"
    const ApiUrl = "https://meaz39id8a.execute-api.ap-south-1.amazonaws.com/dev/"
    const BucketName = "fbs-dev-stack-fbsdevs3bucket208fb333-8guf3ucecus8"
    const FBSDevFBSAPIEndpointBFE33C43 = "https://meaz39id8a.execute-api.ap-south-1.amazonaws.com/dev/"
    const FlightsTable = "FBS-Dev-Stack-FBSDevFlightsTable8B47A605-7L4W0NM3S4RP"
    const IdentityPoolId = "ap-south-1:13cf44d2-3513-4a72-abe6-bf5ddb0fe149"
    const Region = "ap-south-1"
    const SeatsTable = "FBS-Dev-Stack-FBSDevSeatsTable53FB2FAE-IA71JXKOY6KJ"
    const UserPoolClientId = "4sn43hvqjshrli84sitvdjik4u"
    const UserPoolId = "ap-south-1_cMlfqgN8B"
    const UsersTable = "FBS-Dev-Stack-FBSDevUsersTableE907BFAA-8B3FAPABM2V"

    it('Should return a 200', async() => {
        const res = await request(ApiUrl).get('/posts') ;
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Posts loaded successfully')
        expect(res.body).toHaveProperty('results')
    })

    it('Should create a new post', async() => {
        const res = await request(ApiUrl).post('/posts').send({
            title:"this is title 1",
            description: "this is description 2",
            author: "this is author 3",
            publicationDate: "thjis is data 4"
        }) ;
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Post created successfully')
        expect(res.body).toHaveProperty('post')
        expect(res.body.post).toHaveProperty('title')
        expect(res.body.post).toHaveProperty('content')
        expect(res.body.post.title).toBe('Test Post')
        expect(res.body.post.content).toBe('This is a test post')
    })

})