/*==============================================================*/
/* DBMS name:      Sybase SQL Anywhere 12                       */
/* Created on:     14/06/2024 9:51:28                           */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_FACTURA_REFERENCE_CONDUCTO') then
    alter table FACTURA
       delete foreign key FK_FACTURA_REFERENCE_CONDUCTO
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_IDENTIFI_REFERENCE_VEHICULO') then
    alter table IDENTIFICADOR_V1_
       delete foreign key FK_IDENTIFI_REFERENCE_VEHICULO
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_IDENTIFI_REFERENCE_CONDUCTO') then
    alter table IDENTIFICADOR_V1_
       delete foreign key FK_IDENTIFI_REFERENCE_CONDUCTO
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PAGO_REFERENCE_CONDUCTO') then
    alter table PAGO
       delete foreign key FK_PAGO_REFERENCE_CONDUCTO
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TIEMPO_P_REFERENCE_IDENTIFI') then
    alter table TIEMPO_PARQUEO
       delete foreign key FK_TIEMPO_P_REFERENCE_IDENTIFI
end if;

drop table if exists CONDUCTOR;

drop table if exists FACTURA;

drop table if exists IDENTIFICADOR_V1_;

drop table if exists PAGO;

drop table if exists TIEMPO_PARQUEO;

drop table if exists VEHICULO;

/*==============================================================*/
/* Table: CONDUCTOR                                             */
/*==============================================================*/
create table CONDUCTOR 
(
   ID_CONDUCTOR         integer                        not null,
   CEDULA               long varchar                   null,
   NOMBRE               long varchar                   null,
   TELEFONO             long varchar                   null,
   EMAIL                long varchar                   null,
   constraint PK_CONDUCTOR primary key clustered (ID_CONDUCTOR)
);

/*==============================================================*/
/* Table: FACTURA                                               */
/*==============================================================*/
create table FACTURA 
(
   ID_FACTURA           integer                        not null,
   ID_CONDUCTOR         integer                        null,
   MONTO                numeric                        null,
   FECHA                date                           null,
   constraint PK_FACTURA primary key clustered (ID_FACTURA)
);

/*==============================================================*/
/* Table: IDENTIFICADOR_V1_                                     */
/*==============================================================*/
create table IDENTIFICADOR_V1_ 
(
   ID_IDENTIFICADOR     integer                        not null,
   PLACA                long varchar                   null,
   ID_CONDUCTOR         integer                        null,
   FECHA_INGRESO        date                           null,
   FECHA_SALIDA         date                           null,
   constraint PK_IDENTIFICADOR_V1_ primary key clustered (ID_IDENTIFICADOR)
);

/*==============================================================*/
/* Table: PAGO                                                  */
/*==============================================================*/
create table PAGO 
(
   ID_PAGO              integer                        not null,
   ID_CONDUCTOR         integer                        null,
   MONTO                numeric                        null,
   FECHA                date                           null,
   ESTADO               long varchar                   null,
   constraint PK_PAGO primary key clustered (ID_PAGO)
);

/*==============================================================*/
/* Table: TIEMPO_PARQUEO                                        */
/*==============================================================*/
create table TIEMPO_PARQUEO 
(
   ID_TIEMPO            integer                        not null,
   ID_IDENTIFICADOR     integer                        null,
   TIEMPO_PARUQEO       time                           null,
   constraint PK_TIEMPO_PARQUEO primary key clustered (ID_TIEMPO)
);

/*==============================================================*/
/* Table: VEHICULO                                              */
/*==============================================================*/
create table VEHICULO 
(
   PLACA                long varchar                   not null,
   MODELO               long varchar                   null,
   AVALUO               numeric                        null,
   constraint PK_VEHICULO primary key clustered (PLACA)
);

alter table FACTURA
   add constraint FK_FACTURA_REFERENCE_CONDUCTO foreign key (ID_CONDUCTOR)
      references CONDUCTOR (ID_CONDUCTOR)
      on update restrict
      on delete restrict;

alter table IDENTIFICADOR_V1_
   add constraint FK_IDENTIFI_REFERENCE_VEHICULO foreign key (PLACA)
      references VEHICULO (PLACA)
      on update restrict
      on delete restrict;

alter table IDENTIFICADOR_V1_
   add constraint FK_IDENTIFI_REFERENCE_CONDUCTO foreign key (ID_CONDUCTOR)
      references CONDUCTOR (ID_CONDUCTOR)
      on update restrict
      on delete restrict;

alter table PAGO
   add constraint FK_PAGO_REFERENCE_CONDUCTO foreign key (ID_CONDUCTOR)
      references CONDUCTOR (ID_CONDUCTOR)
      on update restrict
      on delete restrict;

alter table TIEMPO_PARQUEO
   add constraint FK_TIEMPO_P_REFERENCE_IDENTIFI foreign key (ID_IDENTIFICADOR)
      references IDENTIFICADOR_V1_ (ID_IDENTIFICADOR)
      on update restrict
      on delete restrict;

