from django.core.management.base import BaseCommand
from apps.users.models import CustomUser
from apps.territories.models import Territory
from apps.comuneros.models import Comunero


class Command(BaseCommand):
    """Llena la base de datos con usuarios, territorios y comuneros de prueba."""

    help = 'Seed database with initial data'

    def handle(self, *args, **options):
        """Crea admin, operador, territorios y comuneros de ejemplo."""
        self._create_users()
        territories = self._create_territories()
        self._create_comuneros(territories)
        self.stdout.write(self.style.SUCCESS('Seed completed'))

    def _create_users(self):
        if not CustomUser.objects.filter(email='admin@cric-colombia.org').exists():
            user = CustomUser.objects.create_user(
                username='admin@cric-colombia.org',
                email='admin@cric-colombia.org',
                password='CricAdmin2026',
                full_name='Administrador CRIC',
                role='admin',
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(f'Admin created: {user.email}')

        if not CustomUser.objects.filter(email='operador@cric-colombia.org').exists():
            user = CustomUser.objects.create_user(
                username='operador@cric-colombia.org',
                email='operador@cric-colombia.org',
                password='CricOper2026',
                full_name='Operador CRIC',
                role='operator',
            )
            self.stdout.write(f'Operator created: {user.email}')

    def _create_territories(self):
        data = [
            ('RESGUARDO INDIGENA DE CORINTO', 'Municipio de Corinto, pueblo Nasa, zona norte del Cauca'),
            ('RESGUARDO INDIGENA DE MIRANDA', 'Municipio de Miranda, pueblo Nasa'),
            ('RESGUARDO INDIGENA DE SILVIA', 'Municipio de Silvia, pueblos Nasa y Misak'),
            ('RESGUARDO INDIGENA DE INZA', 'Municipio de Inza, pueblo Nasa, zona Tierradentro'),
            ('RESGUARDO INDIGENA DE PAEZ', 'Municipio de Paez, pueblo Nasa, zona Tierradentro'),
            ('CABILDO INDIGENA DE KOKONUKO', 'Municipio de Purace, pueblo Kokonuko'),
            ('RESGUARDO INDIGENA DE PURACE', 'Municipio de Purace, pueblo Coconuco'),
            ('RESGUARDO INDIGENA DE LA VEGA', 'Municipio de La Vega, pueblo Yanacona'),
        ]
        territories = []
        for name, desc in data:
            t, created = Territory.objects.get_or_create(name=name, defaults={'description': desc})
            if created:
                self.stdout.write(f'Territory created: {name}')
            territories.append(t)
        return territories

    def _create_comuneros(self, territories):
        data = [
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '1061234567', 'first_name': 'LUIS', 'second_name': 'FERNANDO', 'first_last_name': 'DAGUA', 'second_last_name': 'TOMBE', 'birth_date': '1988-04-12', 'sex': 'MASCULINO', 'phone': '3156789012', 'territory': territories[0]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '1067890123', 'first_name': 'MARLENY', 'first_last_name': 'PECHENE', 'second_last_name': 'VELASCO', 'birth_date': '1975-11-03', 'sex': 'FEMENINO', 'phone': '3209876543', 'territory': territories[0]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '1064567890', 'first_name': 'EVER', 'second_name': 'ALIRIO', 'first_last_name': 'CHOCUE', 'second_last_name': 'MUSICUE', 'birth_date': '1992-07-25', 'sex': 'MASCULINO', 'territory': territories[1]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '2578901234', 'first_name': 'ROSA', 'second_name': 'ELENA', 'first_last_name': 'YATACUE', 'second_last_name': 'NOSCUE', 'birth_date': '1968-02-18', 'sex': 'FEMENINO', 'territory': territories[2]},
            {'document_type': 'TARJETA IDENTIDAD', 'document_number': '1069012345', 'first_name': 'ANDERSON', 'first_last_name': 'CUCHILLO', 'second_last_name': 'DAGUA', 'birth_date': '2008-09-30', 'sex': 'MASCULINO', 'territory': territories[2]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '3456789012', 'first_name': 'DORA', 'second_name': 'INES', 'first_last_name': 'TENORIO', 'second_last_name': 'CHOCUE', 'birth_date': '1983-06-14', 'sex': 'FEMENINO', 'phone': '3112345678', 'territory': territories[3]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '4567890123', 'first_name': 'HERNAN', 'first_last_name': 'MUSICUE', 'second_last_name': 'YATACUE', 'birth_date': '1990-01-08', 'sex': 'MASCULINO', 'territory': territories[4]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '5678901234', 'first_name': 'LUCERO', 'first_last_name': 'NOSCUE', 'second_last_name': 'PECHENE', 'birth_date': '1995-12-22', 'sex': 'FEMENINO', 'territory': territories[4]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '6789012345', 'first_name': 'EDILBERTO', 'first_last_name': 'VELASCO', 'second_last_name': 'TENORIO', 'birth_date': '1970-03-05', 'sex': 'MASCULINO', 'is_active': False, 'territory': territories[5]},
            {'document_type': 'REGISTRO CIVIL', 'document_number': '7890123456', 'first_name': 'VALENTINA', 'first_last_name': 'DAGUA', 'second_last_name': 'NOSCUE', 'birth_date': '2019-05-11', 'sex': 'FEMENINO', 'territory': territories[6]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '8901234567', 'first_name': 'CAMILO', 'second_name': 'ANDRES', 'first_last_name': 'TOMBE', 'second_last_name': 'CUCHILLO', 'birth_date': '1985-08-19', 'sex': 'MASCULINO', 'is_active': False, 'territory': territories[7]},
            {'document_type': 'CEDULA CIUDADANIA', 'document_number': '9012345678', 'first_name': 'GLORIA', 'second_name': 'PATRICIA', 'first_last_name': 'PECHENE', 'second_last_name': 'MUSICUE', 'birth_date': '1978-10-27', 'sex': 'FEMENINO', 'phone': '3178901234', 'territory': territories[7]},
        ]
        for item in data:
            doc = item['document_number']
            if not Comunero.objects.filter(document_number=doc).exists():
                Comunero.objects.create(**item)
                self.stdout.write(f'Comunero created: {item["first_name"]} {item["first_last_name"]}')
