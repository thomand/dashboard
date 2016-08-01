from firebase import firebase

f = firebase.FirebaseApplication('https://dashbordntnu.firebaseio.com/gemini/', None)

test = {"numbers":"1350"}


snapshot = f.patch('Chrome', test)