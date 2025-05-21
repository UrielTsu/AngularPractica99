from rest_framework import serializers
from rest_framework.authtoken.models import Token
from crud_escolar_api.models import *
from rest_framework import serializers
from crud_escolar_api.models import Administradores, Alumnos, Maestros, Eventos

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id','first_name','last_name', 'email')

class AdminSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Administradores
        fields = '__all__'

class AlumnoSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Alumnos
        fields = "__all__"

class MaestroSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Maestros
        fields = '__all__'

class EventosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eventos
        fields = [
            'id',
            'nombre',
            'descripcion',
            'fecha',
            'hora_inicio',
            'hora_fin',
            'es_publico',
            'lugar',
            'tipo_evento',
            'publico_objetivo',
            'programa_educativo',
            'responsable',
            'cupo_maximo',
            'creation',
            'update',
        ]