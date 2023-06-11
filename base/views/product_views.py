from itertools import product
from lib2to3.pgen2 import pgen
from math import prod
from unicodedata import category
from base.models import *
from django.contrib.auth.models import User
from base.serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

# Create your views here.


@api_view(['GET'])
def getBlockchain(request):
    try:
        # orders = Order.objects.get(isPaid = True, totalPrice = 118.2)
        orders = Product.objects.all()
        
        serializer = ProductSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        
        
@api_view(['GET'])
def routes(request):
    return Response("hello ")

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if(query == None):
        query = ''
    products = Product.objects.filter(name__icontains = query)
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 4)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    # print(serializer.data)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    
    products = Product.objects.filter(rating__gte = 4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
 

@api_view(['GET'])
def getProduct(request, pk):
    # product = None
    # for i in products: 
    #     if i['_id'] == pk:
    #         product =  i
    #         break
    # return Response(product)
  
    product = Product.objects.get(_id = pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id = pk)
    product.delete()
    return Response('Deleted product')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='sample name',
        brand= 'sample',
        category = 'elec',
        price = 100,
        countInStock = 0,
        description = ''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = Product.objects.get(_id = pk)
    data = request.data 

    product.name = data['name']
    product.price = data['price']
    product.category = data['category']
    product.brand = data['brand']
    product.description = data['description']
    # product.countInStock = data['countInStock']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['POST'])
def uploadImage(request):
    data = request.data 

    product_id = data['product_id']
    product = Product.objects.get(_id = product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data 
    product = Product.objects.get(_id=pk)

    # 1) Review already exists 
    alreadyExists = product.review_set.filter(user = user).exists()

    if alreadyExists:
        content = {'detail': 'product is already reviewed'}
        return Response(content, status= status.HTTP_400_BAD_REQUEST)

    # 2) Review exists but rating is 0 
    elif data['rating'] == 0:
        content = {'detail': 'product rating is 0'}
        return Response(content, status= status.HTTP_400_BAD_REQUEST)

    # 3) Create review 
    else:
        review = Review.objects.create(
            user=user,
            product = product,
            name = user.username,
            rating = data['rating'],
            comment= data['comment']
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total/len(reviews)

        product.save()
        return Response('review added')
    


