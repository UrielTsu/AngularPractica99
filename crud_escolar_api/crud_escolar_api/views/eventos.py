
from django.shortcuts import render, get_object_or_404
from django.db.models import *
from django.db import transaction
from crud_escolar_api.serializers import *
from crud_escolar_api.models import *
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions, generics, status, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from django.core import serializers
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.models import Group
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from django.conf import settings
from django.template.loader import render_to_string
from datetime import datetime
import string
import random
import json

class EventosAll(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        eventos = Eventos.objects.all().order_by("id")
        lista = EventosSerializer(eventos, many=True).data
        if not lista:
            return Response({}, 400)
        return Response(lista, 200)

class EventosView(generics.CreateAPIView):
    def get(self, request, *args, **kwargs):
        evento = get_object_or_404(Eventos, id=request.GET.get("id"))
        evento = EventosSerializer(evento, many=False).data
        return Response(evento, 200)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = EventosSerializer(data=request.data)
        if serializer.is_valid():
            evento = serializer.save()
            return Response({"evento_created_id": evento.id}, 201)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventosViewEdit(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        evento = get_object_or_404(Eventos, id=request.data["id"])
        serializer = EventosSerializer(evento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, 200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        evento = get_object_or_404(Eventos, id=request.GET.get("id"))
        try:
            evento.delete()
            return Response({"details": "Evento eliminado"}, 200)
        except Exception:
            return Response({"details": "Algo pasó al eliminar"}, 400)

# Nueva vista basada en función para obtener todos los eventos
@api_view(['GET'])
def lista_eventos(request):
    eventos = Eventos.objects.all().order_by("id")
    serializer = EventosSerializer(eventos, many=True)
    return Response(serializer.data, status=200)