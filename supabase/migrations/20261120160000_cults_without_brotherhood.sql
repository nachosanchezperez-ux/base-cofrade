-- Los cultos pueden ser parroquiales, diocesanos o independientes.
-- La localidad permite su publicación en la Agenda sin inventar una hermandad.
ALTER TABLE public.cults
  ALTER COLUMN brotherhood_entity_id DROP NOT NULL;

ALTER TABLE public.cults
  ADD COLUMN IF NOT EXISTS municipality_id uuid REFERENCES public.municipalities(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS place_text text;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'cults_unlinked_municipality_check'
      AND conrelid = 'public.cults'::regclass
  ) THEN
    ALTER TABLE public.cults
      ADD CONSTRAINT cults_unlinked_municipality_check
      CHECK (brotherhood_entity_id IS NOT NULL OR municipality_id IS NOT NULL);
  END IF;
END
$;

CREATE INDEX IF NOT EXISTS cults_municipality_id_idx
  ON public.cults (municipality_id)
  WHERE brotherhood_entity_id IS NULL;

COMMENT ON COLUMN public.cults.brotherhood_entity_id IS
  'Opcional: los cultos parroquiales o independientes no necesitan hermandad.';
COMMENT ON COLUMN public.cults.municipality_id IS
  'Localidad del culto cuando no se vincula a una hermandad.';
COMMENT ON COLUMN public.cults.place_text IS
  'Nombre del lugar cuando no existe todavía una ficha de sede.';
