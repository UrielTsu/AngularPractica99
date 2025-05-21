from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import Group, User
from crud_escolar_api.serializers import *
from crud_escolar_api.models import *

class AlumnosAll(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        alumnos = Alumnos.objects.filter(user__is_active=1).order_by("id")
        alumnos = AlumnoSerializer(alumnos, many=True).data
        return Response(alumnos, 200)

class AlumnosView(generics.CreateAPIView):
    # GET por ID
    def get(self, request, *args, **kwargs):
        alumno_id = request.GET.get("id")
        if not alumno_id:
            return Response({"error": "Parámetro 'id' requerido."}, status=400)

        alumno = get_object_or_404(Alumnos, id=alumno_id)
        data = AlumnoSerializer(alumno, many=False).data
        return Response(data, 200)

    # POST (crear nuevo alumno)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            role = request.data.get('rol')
            if not role:
                return Response({"message": "El campo 'rol' es obligatorio."}, status=400)

            email = request.data.get('email', '')
            existing_user = User.objects.filter(email=email).first()
            if existing_user:
                return Response({"message": f"Username {email}, is already taken"}, status=400)

            user = User.objects.create(
                username=email,
                email=email,
                first_name=request.data.get('first_name', ''),
                last_name=request.data.get('last_name', ''),
                is_active=1
            )
            user.set_password(request.data.get('password', ''))
            user.save()

            group, _ = Group.objects.get_or_create(name=role)
            group.user_set.add(user)

            alumno = Alumnos.objects.create(
                user=user,
                matricula=request.data.get('matricula', ''),
                fecha_nacimiento=request.data.get('fecha_nacimiento', None),
                curp=request.data.get('curp', '').upper(),
                rfc=request.data.get('rfc', '').upper(),
                edad=request.data.get('edad', 0),
                telefono=request.data.get('telefono', ''),
                ocupacion=request.data.get('ocupacion', '')
            )
            return Response({"alumno_created_id": alumno.id}, status=201)
        
        return Response(user_serializer.errors, status=400)

class AlumnosViewEdit(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    # PUT (editar alumno)
    def put(self, request, *args, **kwargs):
        alumno_id = request.data.get("id")
        alumno = get_object_or_404(Alumnos, id=alumno_id)

        alumno.matricula = request.data.get("matricula", alumno.matricula)
        alumno.telefono = request.data.get("telefono", alumno.telefono)
        alumno.rfc = request.data.get("rfc", alumno.rfc).upper()
        alumno.edad = request.data.get("edad", alumno.edad)
        alumno.ocupacion = request.data.get("ocupacion", alumno.ocupacion)
        alumno.save()

        user = alumno.user
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()

        data = AlumnoSerializer(alumno, many=False).data
        return Response(data, 200)

    # DELETE (eliminar alumno)
    def delete(self, request, *args, **kwargs):
        alumno_id = request.GET.get("id")
        alumno = get_object_or_404(Alumnos, id=alumno_id)
        try:
            alumno.user.delete()
            return Response({"details": "Alumno eliminado correctamente."}, status=200)
        except Exception as e:
            return Response({"details": f"Error al eliminar: {str(e)}"}, status=400)
