
import app from "../app";
import users from "../models/users";
import { encrypt, generateToken ,decrypt} from "../utils/encryption";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { SITE_KV } from "../drivers/cache";

app.post("/register", async(c)=>{
    const newUser = (await c.req.json()) as any;   
    console.log(newUser);
    const existingUser = await users.First({where: {email: newUser.email}});   
    if(existingUser) {
    }else{
        const encryptPassword = await encrypt(newUser.password);
        await users.InsertOne({name: newUser.firstName, email:newUser.email, password: encryptPassword})
        return c.json({status: true})
    }    
    return c.text("this email is already register", 403)
})
app.post("/login", async(c) => {
    const input = (await c.req.json()) as any;
    const getUser = await users.First({where: {email: input.email}});
    const decryptPassword = await decrypt(getUser?.password);
    if(getUser && getUser.email == input.email && decryptPassword == input.password) {
        // const token = generateToken(input);   
        // console.log("token", token);
        //     return c.text("ok")
    } 
    // else {
    //     return c.text("your email and password are incorrect");
    // }
    // if(getUser) {
    //     return c.text("this email is already", 403);
    // } else {

    // }
    // console.log("getUser", getUser);
    // return c.text("this is my login page")
})
app.put("/change-password", async(c)=>{
    const input = (await c.req.json()) as any;
    const decryptPassword = await decrypt(input.password);         
    if (input && input.email == input.email && decryptPassword == input.oldpassword) {
        const password = await encrypt(input.password);
        await users.Update({ where: { id: input.id }, data: { password } });
        return c.text('success');
    } else {
        return c.text('Incorrect email & password')
    }
})
//to forget password //
const jwtSecret = "some super secret";
app.post("/forgot-password", async(c) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    const input = (await c.req.json()) as any;        
    const user = await users.First({where: {email: input.email}});
    if(input !== user){
        // return c.text("user not registerd");
    }
    const secret = jwtSecret + input?.password;
    const payload = {
        email: input.email,
        id: input.id, 
        code: code
    }
    const token =jwt.sign(payload, secret);
     await c.env.KV.put(input.email, code.toString());
    const link = "http://local:3000/reset-password/${input.id}/${token}";
    console.log("coode", code);
    return c.json("passwors reset and link has sent to your email")

})
app.post("/confirm-code", async(c) =>{
    const input = (await c.req.json()) as any;
    const user = await users.First({where: {email: input.email}});
     const code = await c.env.KV.get(input.email);
     if(code == input.code){
        return c.text("success")

     } else {
        return c.text("not match the codde", 400)
     }   
})
app.post("/reset-password", async(c) =>{

    const input = (await c.req.json()) as any;
    console.log("to check", input)
    const user = await users.First({where: {email: input.email}})
    const encryptPassword = await decrypt(input.password);
    await users.Update({where: {id: user?.id}, data: {password: encryptPassword}})
    return c.text("ok")
})




