x = int(input("Enter the Value: "))
y = int(input("Enter the Second Value: "))

a = "a = Addition"
b = "b = Subtraction"
c = "c = Multiplication"
d = "d = Division"

print(a)
print(b)
print(c)
print(d)

choice = input("Enter choice (a/b/c/d): ")

if choice== 'a':
     print(x + y)

elif choice== 'b':
     print(x - y)

elif choice== 'c':
     print(x*y)

elif choice== 'd':
     print(x/y)

else:
     print("input not valid")
