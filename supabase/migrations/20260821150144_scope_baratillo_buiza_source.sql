-- Evita que una fuente específica del paso de palio del Baratillo se herede
-- por otras fichas donde Francisco Buiza también figure como autor o interviniente.
-- La fuente conserva sus enlaces específicos a la intervención y al patrimonio
-- del Baratillo; se retira únicamente el enlace genérico y redundante al agente.

delete from public.source_links
where id = '84c67311-6830-4f60-b8b6-2bab43a31645'
  and source_id = '70142a0e-e58a-41e3-8454-def2b40d5b9d'
  and entity_id = '160be307-5396-41a2-8903-7467a8c330f3'
  and scope = 'agente:paso-caridad';
