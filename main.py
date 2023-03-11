from gatewayConfig import gatewayConfig

from api_key import *


if __name__ == '__main__':
    gc = gatewayConfig(AIO_USERNAME, AIO_KEY)

    gc.run()