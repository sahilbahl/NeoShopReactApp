from boa.interop.Neo.Storage import GetContext, Put, Get
APPLICATION_UUID = 'bd65600d-8669-4903-8a14-af88203add38'

def Main(operation, args):
    if operation != None:
        if operation == 'GetProductListHash':
            productList = Get(GetContext(), APPLICATION_UUID)
            return productList

        if operation == 'UpdateProductListHash':
            Put(GetContext(), APPLICATION_UUID, args[0])
            return True
