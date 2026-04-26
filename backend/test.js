
fetch('http://localhost:1337/api/auth/local/register', {
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({username:'debug7',email:'debug7@x.com',password:'password'})
}).then(r=>r.json()).then(async d => {
  const jwt = d.jwt;
  const uid = d.user.id;
  
  let c = await fetch('http://localhost:1337/api/todos',{
    method:'POST',
    headers:{'Content-Type':'application/json',Authorization:'Bearer '+jwt},
    body:JSON.stringify({data:{title:'test todo',isCompleted:false,user:uid}})
  }).then(r=>r.json());
  console.log('Create:', c);
  
  if(c.data) {
    let u = await fetch('http://localhost:1337/api/todos/'+c.data.documentId, {
      method:'PUT',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+jwt},
      body:JSON.stringify({data:{isCompleted:true}})
    });
    console.log('Update Status:', u.status);
    console.log('Update Body:', await u.text());
    
    let del = await fetch('http://localhost:1337/api/todos/'+c.data.documentId, {
      method:'DELETE',
      headers:{Authorization:'Bearer '+jwt}
    });
    console.log('Delete Status:', del.status);
  }
}).catch(console.error);

