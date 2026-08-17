-- Limpieza o inserción directa de 10 animales con datos de campo realistas
DO $$ 
DECLARE   
  v_id UUID; 
BEGIN   
  -- 1. Ternero Angus Negro   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('AR8921PL', '2025-09-10', 32.5, 185.0, 'Negro', 'Negro', 'Colorado', 'Angus Negro', 'Excelente conformación carnicera')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 240.0, '2026-03-15 09:30:00', 'Control post-destete'),     
    (v_id, 295.0, '2026-06-20 10:15:00', 'Pesaje entrada a verde');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Mancha y Gangrena', '2025-11-05'),     
    (v_id, 'Aftosa Bivalente', '2026-03-20');    
    
  -- 2. Vaquillona Hereford   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('HF4402TX', '2025-08-04', 34.0, 192.0, 'Pampa Colorado', 'Pampa Colorado', 'Pampa Colorado', 'Hereford Definido', 'Destinada a reposición de cría')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 255.0, '2026-02-10 08:00:00', 'Pesaje de servicio'),     
    (v_id, 310.0, '2026-07-12 11:00:00', 'Control pre-servicio');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Reproductiva (IBR/DVB)', '2026-02-15');    
    
  -- 3. Novillito Braford   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('BF1033AR', '2025-10-18', 31.0, 178.0, 'Pampa Oscuro', 'Colorado', 'Brahman Blanco', 'Braford 3/8', 'Muy rústico, buena ganancia')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 220.0, '2026-04-02 16:30:00', 'Pesaje lote 3'),     
    (v_id, 268.0, '2026-07-25 15:00:00', 'Pesaje invierno');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Triple Clostridial', '2025-12-10');    
    
  -- 4. Ternera Brangus Colorada   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('BG7719CO', '2025-11-01', 29.5, 168.0, 'Colorado', 'Colorado', 'Negro', 'Brangus Colorado', 'Hija de toro de cabaña')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 215.0, '2026-05-18 10:00:00', 'Control de sanidad');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Carbunclo Bacteridiano', '2026-01-20');    
    
  -- 5. Torito Angus Colorado   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('AC0094LP', '2025-07-22', 36.0, 210.0, 'Colorado', 'Colorado Mocha', 'Colorado', 'Angus Colorado', 'Posible reproductor')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 290.0, '2026-01-30 08:30:00', 'Pesaje destete tardío'),     
    (v_id, 365.0, '2026-06-05 09:00:00', 'Pesaje 11 meses');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Aftosa Bivalente', '2026-03-20'),     
    (v_id, 'Complejo Respiratorio Bovino', '2025-09-15');    
    
  -- 6. Vaca Criolla / Cruza   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('CR8812BB', '2024-11-14', 28.0, 160.0, 'Overo Negro', 'Baya', 'Hosco', 'Cruza Industrial', 'Madre muy lechera')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 380.0, '2025-11-14 17:00:00', 'Pesaje anual'),     
    (v_id, 415.0, '2026-05-20 14:00:00', 'Pesaje tacto');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Brucelosis (Cepa 19)', '2025-03-10');    
    
  -- 7. Ternero Limousin Cruza   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('LM5520CZ', '2025-12-05', 38.0, 195.0, 'Bayo Dorado', 'Negra', 'Colorado', 'Limousin x Angus', 'Mucha masa muscular en cuartos traseros')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 245.0, '2026-06-10 11:30:00', 'Pesaje de ingreso al corral');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Queratoconjuntivitis', '2026-02-01');    
    
  -- 8. Vaquillona Brangus Negra   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('BN3391SL', '2025-09-28', 30.0, 175.0, 'Negro Azabache', 'Negra', 'Negro', 'Brangus Negro', 'Lote de inseminación a tiempo fijo')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 230.0, '2026-03-25 10:30:00', 'Control post-destete'),     
    (v_id, 280.0, '2026-07-30 09:00:00', 'Pesaje pre-IATF');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Aftosa Bivalente', '2026-03-20');    
    
  -- 9. Novillo Holando Argentino   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('HA1900BA', '2025-05-12', 40.0, 150.0, 'Overo Negro', 'Overo Negro', 'Overo Negro', 'Holando Argentino', 'Criado al pie, destinado a engorde a corral')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 280.0, '2025-12-20 18:00:00', 'Entrada a recría'),     
    (v_id, 350.0, '2026-04-15 11:00:00', 'Pesaje corral 1'),     
    (v_id, 410.0, '2026-08-01 10:00:00', 'Pesaje terminación');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Clostridiosis 8 Vías', '2025-08-10');    
    
  -- 10. Ternera Charolais Cruza   
  INSERT INTO public.animals (caravana_number, birth_date, weight_birth, weight_weaning, pelaje_padre, pelaje_madre, pelaje_abuelo, genetica, observations)   
  VALUES ('CH6201PL', '2025-10-02', 35.0, 188.0, 'Blanco Pajizo', 'Colorada', 'Pampa', 'Charolais x Angus', 'Excelente frame y conformación ósea')   
  RETURNING id INTO v_id;   
  
  INSERT INTO public.weights (animal_id, weight_kg, recorded_at, notes) VALUES      
    (v_id, 235.0, '2026-04-20 09:00:00', 'Control general'),     
    (v_id, 285.0, '2026-08-10 16:30:00', 'Pesaje fin de pastoreo');   
    
  INSERT INTO public.vaccines (animal_id, vaccine_name, application_date) VALUES      
    (v_id, 'Mancha y Gangrena', '2025-12-15'),     
    (v_id, 'Aftosa Bivalente', '2026-03-20'); 
END $$;
