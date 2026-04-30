CONVEX_DEPLOY_KEY="prod:warmhearted-kingfisher-830|eyJ2MiI6IjQyMmQ3ZGJmMDI1ZjQ0MDQ4OTI5NmRmYWY2OWYzNzdiIn0=" npx convex env set JWT_PRIVATE_KEY "$(cat pkcs8.pem)"
CONVEX_DEPLOY_KEY="prod:warmhearted-kingfisher-830|eyJ2MiI6IjQyMmQ3ZGJmMDI1ZjQ0MDQ4OTI5NmRmYWY2OWYzNzdiIn0=" npx convex env set JWT_PUBLIC_KEY "$(cat public.pem)"
CONVEX_DEPLOY_KEY="prod:warmhearted-kingfisher-830|eyJ2MiI6IjQyMmQ3ZGJmMDI1ZjQ0MDQ4OTI5NmRmYWY2OWYzNzdiIn0=" npx convex env set AUTH_SECRET c98d3637e19d67188d3e9f45672c8469e8f00123456789abcdef0123456789ab
