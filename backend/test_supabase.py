from supabase_client import supabase

response_l = (
    supabase
    .table("Market_location")
    .select("*")
    .limit(5)
    .execute()
)

print("Data from Supabase:")
print(response_l.data)


response_p = (
    supabase
    .table("Market_price")
    .select("*")
    .limit(5)
    .execute()
)

print("Onion Date : ")
print(response_p.data)