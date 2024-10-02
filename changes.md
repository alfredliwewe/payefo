1. ku admin kukuoneka kuti expire date plan njamwez koma ku student account ikuonesa 3 months plan nde check it out...
2. maLessons kwastudent akungobwera a chichewa literature  okhaokha despite kusakha subject ina zikubwerabe zokhazokhazo  please check it out...
3.  Pangani delete malessons onse timangoyeserawo, matests onse alipowo ndi ma resorces/books onse alipowo kuti tiikepo eni eni....
4. Munthu amene sanalipirenso itsekeni isamamusegulile kalikonse izimuuza zijazi imati you do not have any subscription zija....
5. bwenzeretsaniso payment method ija on both registration and payment plan....



```sql
ALTER TABLE `registration` ADD `last_updated` TEXT NOT NULL AFTER `subjects`;
```
tikalowa ku registration ikundibwiresera error yared mmwambamo...check *done*

then ku malessons yes ndasakha subject koma kupanga submit sikubweresanso check...but calling for my class nde ikundifikisa paclass yangayo - *done*


KODI KUREGISTRATION SIKUNGAKHALE KONGOPANGA KAMOZI BASI THEN KUZIPANGA DISAPPEAR? _ will put that should not be allowed to change form after two months _

check kopanga register ndikapanga save ikundipasaso red error check it - *done* 
Will check them

0:22

ok fine ndakumva let me try it... koma check kuregistration coz ticking some kupanga save sakutheka kut aoneke ku malessons and ku ma tests masubjects amene wasakhawo sakubwera and saving ikukana
how to select a lesson republish?
kwamphunzitsiko ndakutolera its ok...  re activating the lesson zabobo ... koma now check ma errors kwa student coz sikupangabe display
Okay bwana.. will do
kwastudent pa file ndinatinso file izikhala image not video coz apapa without attaching a video koma kwastudent ikubweretsabe video iliyonse from the database file nde check it as well....

kwa student test is displaying only challenge ndi ku registration and lessons basi so check it out


GAWO LINA KU ADMIN SECTION

Ku mastaff ikani button loti  nditha kumamudilita mphunzitsi bobo....
komanso muike zoti nditha kudilia mwana wasukulu as well....
Mesa activeness yake paja izikhala automatic yokha akalipila via paychangu?
UKAKHUZA MA AREAS AMENEWAWA UBWEZERETSA PAYMENT YA REGISTRATION NDI PAYMENT YA MONTHLY IJA
Okay okay.. will do this soon
Do you happen to have 5pin.. tasauka kwambir
as of now nooo... ndipange check wina wake akapezeka nayo will do the needeful
Please 🙏.. pangani
sure
ukapanga update undiuza ndichecke
ukapanga update undiuza ndichecke

Folokiya Mavuto
Okay okay 🤝
sure


```sql
ALTER TABLE `lessons` ADD `active_from` TEXT NULL AFTER `date_added`, ADD `active_to` TEXT NULL AFTER `active_from`;
UPDATE `lessons` SET active_from = date_added, active_to = date_added + (24*7*3600) WHERE 1;
```