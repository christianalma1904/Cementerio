from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Errores 400 / 404 controlados por DRF
        return Response(
            {
                "detail": response.data,
                "status_code": response.status_code,
            },
            status=response.status_code,
        )

    # Errores 500 u otros no controlados
    return Response(
        {
            "detail": "Error interno del servidor. Contacte al administrador.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
