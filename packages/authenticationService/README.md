# Authentication and Authorization

Basically, every call into a Gateway will look for Authentication, (a JWT), but then it just passes that JWT through. Gateways never block on authenticated or not, that is up to the actual service to care about. This way, the Gateway does not need to know the authentication requirements of the underlying services. When you make a call to a gateway, there are 2 types of tokens you can provide
    -1. the User Token, which is the main token and says, "This is who I am" 
    -2. zero or more Delegation Tokens, which just claim, these are credentials or things I can access right now, I have been delegated these priviledges.


The way this works in practice is that if for example I, Charlie, a Customer Service rep, wants to access the info for Baris, some bum on the street, the Identity service will deny that access, because it only gives access to Baris' info to Baris. But if Baris has given Charlie a delegation token, Charlie can present that along with his User Token, and the Identity Service will grant access to Baris' info to Charlie. Easy enough

This system can be used a BUNCH of things.
One thing that a User Token encodes, though, is your Corporate access
In the JWT we issue, there is a "corporates" field that encodes corporate IDs and roles
So, for anything Corporate related, usually what we care about is not who you are, but what role you have in the Corporate, which you can get from the User token.

AuthenticationUtils is super handy, it has things like "assureAccessToCorporate(userContext, corporateId, minimumCorporateRole)".
Access to a corporate can come from either your User Token OR from a delegation token.
The Corporate API (for machine-to-machine communications) uses a Corporate Credential, so the machine has a corporate ID and a secret, and trades that for an auth token (JWT) that does not include a claim about being a particular user. It just includes a claim that you have access to a particular Corporate.

assureAccessToCorporate() should be used for things like Campaign updates and most things we do in the Corporate, Referral Link, and Collection services. Referral Links and Collections are owned by a Corporate, so that can determine access.
The Admin status, and assureUserIsAdmin() is a special one and should be used, and granted, exceptionally rarely. The Admin flag in a JWT is a get out of jail free card.
All the methods in AuthenticationUtils will look for that first and then just say "Yes!"
It's super powerful and therefore super risky. you can use assureAccessToIdentity() or assureAccessToCorporate() (or both if you need to), and they will respect the Admin flag, so assureUserIsAdmin() should only be used for like seriously Admin-level stuff

Each service creates and maintains a JWT that just includes a claim about what service it is. We use this for internal request signing, AND we can use it to limit access to a method. For instance, in the Identity Service, there are times when you need access to ALL identities. We can't manage delegation tokens for that. So, any method like that is very powerful and very risky.
So instead, in the Identity Service, you can use assureServiceAuthenticated() and give it a list of authorized services. I use this for getting access to user emails by the Notification service. Only the Notification Service is authorized to get that info; other people need to have access to the Identity specifically.

User Contexts flow through the system. A User Context is just the tokens themselves, so you can't forge anything. When a service recieves a request, a UserContext is attached. The service then makes a call to the AuthenticationService to Resolve the tokens- this returns a ResolvedUserContext. ResolvedUserContext includes the tokens AND the data inside those tokens. If the tokens are invalid, the ResolvedToken is blank or null (can't remember which).
UserContext has 3 tokens types: user, delgation, and service.

Service is the Service token of the originating service. One key thing is that the service token is updated as it is passed on!
So, Service A calls B. B receives A's service token. B then calls C. C then gets B's service token, but it gets the original User and Delegation tokens.