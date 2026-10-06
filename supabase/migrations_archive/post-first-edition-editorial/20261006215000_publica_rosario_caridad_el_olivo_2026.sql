-- Agenda/ficha · Rosario Vespertino de Santa María de la Caridad · 10 octubre 2026
-- DML editorial idempotente. No modifica esquema.
-- Sincroniza producción con el cartel aportado el 2026-10-06.

begin;

update public.outings
set departure_time=time '18:45', return_time=time '21:30', route_summary='Parroquia de Santa María Madre de Dios → Velázquez → Alberto Lista → Plaza Azorín → Pasaje peatonal de la Biblioteca Municipal → Luis de Góngora → Juan de la Cueva → Guadalcanal → Granada → Cultura → Valdés Leal → Juan de la Cueva → Maese Rodrigo → Alberto Lista → Velázquez → Parroquia de Santa María Madre de Dios.', public_notes='Salida a las 18:45 y entrada prevista a las 21:30.', updated_at=now()
where slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026';

commit;
