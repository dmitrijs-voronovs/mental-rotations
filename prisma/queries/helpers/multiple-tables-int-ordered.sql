create or replace function get_first_additional_test_per_user(testType "AdditionalTestType")
    returns table
            (
                "userId"    text,
                id          text,
                "createdAt" timestamp(3),
                type        "AdditionalTestType",
                data        jsonb
            )
as
$$
begin
    return query select distinct on ("userId") ADT."userId", ADT.id, ADT."createdAt", ADT.type, ADT.data
                 from "AdditionalTest" ADT
                 where ADT.type = testType
                 order by ADT."userId";
end
$$ language plpgsql;

create or replace function get_user_info_data()
    returns table
            (
                "id"                            text,
                "testGroup"                     integer,
                "userId"                        text,
                "age"                           integer,
                "gender"                        text,
                "occupation"                    text,
                "isRightHanded"                 integer,
                "academicField"                 text,
                "hasNeurodegenerativeIllnesses" text
            )
as
$$
begin
    return query select UI.id,
--        info,
                        UI."testGroup",
                        UI."userId",
                        (UI.info::json ->> 'age')::integer                        as age,
                        (UI.info::json ->> 'gender')::text                        as gender,
                        (UI.info::json ->> 'occupation')::text                    as occupation,
                        ((UI.info::json ->> 'isRightHanded')::bool)::integer                 as "isRightHanded",
                        (UI.info::json ->> 'academicField')::text                 as "academicField",
--              TODO: make all strings
                        (UI.info::json ->> 'hasNeurodegenerativeIllnesses')::text as "hasNeurodegenerativeIllnesses"
                 from "UserInfo" as UI;
end
$$ language plpgsql;


-- all user additional test data
create or replace function get_depression_test_data()
    returns table
            (
                "userId"           text,
                "id"               text,
                "createdAt"        timestamp(3),
                "type"             "AdditionalTestType",
                "PHQ-0 total"      integer,
                "PHQ-9 question 1" integer,
                "PHQ-9 question 2" integer,
                "PHQ-9 question 3" integer,
                "PHQ-9 question 4" integer,
                "PHQ-9 question 5" integer,
                "PHQ-9 question 6" integer,
                "PHQ-9 question 7" integer,
                "PHQ-9 question 8" integer
            )
as
$$
begin
    return query select "FirstDepressionTest"."userId",
                        "FirstDepressionTest".id,
                        "FirstDepressionTest"."createdAt",
                        "FirstDepressionTest".type,
                        ("FirstDepressionTest".data::json ->> 'total')::integer as "PHQ-0 total",
                        ("FirstDepressionTest".data::json ->> '0')::integer     as "PHQ-9 question 1",
                        ("FirstDepressionTest".data::json ->> '1')::integer     as "PHQ-9 question 2",
                        ("FirstDepressionTest".data::json ->> '2')::integer     as "PHQ-9 question 3",
                        ("FirstDepressionTest".data::json ->> '3')::integer     as "PHQ-9 question 4",
                        ("FirstDepressionTest".data::json ->> '4')::integer     as "PHQ-9 question 5",
                        ("FirstDepressionTest".data::json ->> '5')::integer     as "PHQ-9 question 6",
                        ("FirstDepressionTest".data::json ->> '6')::integer     as "PHQ-9 question 7",
                        ("FirstDepressionTest".data::json ->> '7')::integer     as "PHQ-9 question 8"
                 from (select *
                       from get_first_additional_test_per_user(testType := 'PHQ9')) as "FirstDepressionTest";
end
$$ language plpgsql;


create or replace function get_emotion_test_data()
    returns table
            (
                "userId"          text,
                "id"              text,
                "createdAt"       timestamp(3),
                "type"            "AdditionalTestType",
                "Bauda"           integer,
                "Kauns"           integer,
                "Naids"           integer,
                "Vaina"           integer,
                "Bailes"          integer,
                "Dusmas"          integer,
                "Prieks"          integer,
                "Lepnums"         integer,
                "Nozela"          integer,
                "Riebums"         integer,
                "Skumjas"         integer,
                "Apbrina"         integer,
                "Interese"        integer,
                "Milestiba"       integer,
                "Milestiba2"      integer,
                "Vilsanas"        integer,
                "Nicinajums"      integer,
                "Atvieglojums"    integer,
                "Lidzjutiba"      integer,
                "Apmierinajums"   integer,
                "Uzjautrinajums"  integer,
                "Another emotion" text,
                "totalpoints"     integer
            )
as
$$
begin
    return query select *,
                        (ET."Bauda" +
                         ET."Kauns" +
                         ET."Naids" +
                         ET."Vaina" +
                         ET."Bailes" +
                         ET."Dusmas" +
                         ET."Prieks" +
                         ET."Lepnums" +
                         ET."Nozela" +
                         ET."Riebums" +
                         ET."Skumjas" +
                         ET."Apbrina" +
                         ET."Interese" +
                         coalesce(ET."Milestiba", 0) +
                         coalesce(ET."Milestiba2", 0) +
                         ET."Vilsanas" +
                         ET."Nicinajums" +
                         ET."Atvieglojums" +
                         ET."Lidzjutiba" +
                         ET."Apmierinajums" +
                         ET."Uzjautrinajums") "totalPoints"
                 from (select FirstEmotionTest."userId",
                              FirstEmotionTest.id,
                              FirstEmotionTest."createdAt",
                              FirstEmotionTest.type,
                              (data::json ->> 'Bauda')::integer          as "Bauda",
                              (data::json ->> 'Kauns')::integer          as "Kauns",
                              (data::json ->> 'Naids')::integer          as "Naids",
                              (data::json ->> 'Vaina')::integer          as "Vaina",
                              (data::json ->> 'Bailes')::integer         as "Bailes",
                              (data::json ->> 'Dusmas')::integer         as "Dusmas",
                              (data::json ->> 'Prieks')::integer         as "Prieks",
                              (data::json ->> 'Lepnums')::integer        as "Lepnums",
                              (data::json ->> 'Nožela')::integer         as "Nozela",
                              (data::json ->> 'Riebums')::integer        as "Riebums",
                              (data::json ->> 'Skumjas')::integer        as "Skumjas",
                              (data::json ->> 'Apbrīna')::integer        as "Apbrina",
                              (data::json ->> 'Interese')::integer       as "Interese",
                              (data::json ->> 'Milestība')::integer      as "Milestiba",
                              (data::json ->> 'Mīlestība')::integer      as "Milestiba2",
                              (data::json ->> 'Vilšanās')::integer       as "Vilsanas",
                              (data::json ->> 'Nicinājums')::integer     as "Nicinajums",
                              (data::json ->> 'Atvieglojums')::integer   as "Atvieglojums",
                              (data::json ->> 'Līdzjutība')::integer     as "Lidzjutiba",
                              (data::json ->> 'Apmierinājums')::integer  as "Apmierinajums",
                              (data::json ->> 'Uzjautrinājums')::integer as "Uzjautrinajums",
                              (data::json ->> 'other')::text             as "Another emotion"
                       from (select *
                             from get_first_additional_test_per_user(testType := 'EMOTION_WHEEL')) as FirstEmotionTest) ET;
end
$$ language plpgsql;


create or replace function get_actual_test_data()
    returns table
            (
                "id"                      text,
                "createdAt"               timestamp(3),
                "userId"                  text,
                "testId"                  text,
                "task1_completed_answer"  integer,
                "task2_completed_answer"  integer,
                "task3_completed_answer"  integer,
                "task4_completed_answer"  integer,
                "task5_completed_answer"  integer,
                "task6_completed_answer"  integer,
                "task7_completed_answer"  integer,
                "task8_completed_answer"  integer,
                "task9_completed_answer"  integer,
                "task10_completed_answer" integer,
                "task11_completed_answer" integer,
                "task12_completed_answer" integer,
                "task13_completed_answer" integer,
                "task14_completed_answer" integer,
                "task15_completed_answer" integer,
                "task16_completed_answer" integer,
                "task17_completed_answer" integer,
                "task18_completed_answer" integer,
                "task19_completed_answer" integer,
                "task20_completed_answer" integer,
                "task21_completed_answer" integer,
                "task22_completed_answer" integer,
                "task23_completed_answer" integer,
                "task24_completed_answer" integer,
                "task1_completed_time"    double precision,
                "task2_completed_time"    double precision,
                "task3_completed_time"    double precision,
                "task4_completed_time"    double precision,
                "task5_completed_time"    double precision,
                "task6_completed_time"    double precision,
                "task7_completed_time"    double precision,
                "task8_completed_time"    double precision,
                "task9_completed_time"    double precision,
                "task10_completed_time"   double precision,
                "task11_completed_time"   double precision,
                "task12_completed_time"   double precision,
                "task13_completed_time"   double precision,
                "task14_completed_time"   double precision,
                "task15_completed_time"   double precision,
                "task16_completed_time"   double precision,
                "task17_completed_time"   double precision,
                "task18_completed_time"   double precision,
                "task19_completed_time"   double precision,
                "task20_completed_time"   double precision,
                "task21_completed_time"   double precision,
                "task22_completed_time"   double precision,
                "task23_completed_time"   double precision,
                "task24_completed_time"   double precision,
                "task1_isCorrect"         integer,
                "task2_isCorrect"         integer,
                "task3_isCorrect"         integer,
                "task4_isCorrect"         integer,
                "task5_isCorrect"         integer,
                "task6_isCorrect"         integer,
                "task7_isCorrect"         integer,
                "task8_isCorrect"         integer,
                "task9_isCorrect"         integer,
                "task10_isCorrect"        integer,
                "task11_isCorrect"        integer,
                "task12_isCorrect"        integer,
                "task13_isCorrect"        integer,
                "task14_isCorrect"        integer,
                "task15_isCorrect"        integer,
                "task16_isCorrect"        integer,
                "task17_isCorrect"        integer,
                "task18_isCorrect"        integer,
                "task19_isCorrect"        integer,
                "task20_isCorrect"        integer,
                "task21_isCorrect"        integer,
                "task22_isCorrect"        integer,
                "task23_isCorrect"        integer,
                "task24_isCorrect"        integer,


                "total_isCorrect"         integer
            )
as
$$
begin
    return query select *,
                        (
                                C."task1_isCorrect" +
                                C."task2_isCorrect" +
                                C."task3_isCorrect" +
                                C."task4_isCorrect" +
                                C."task5_isCorrect" +
                                C."task6_isCorrect" +
                                C."task7_isCorrect" +
                                C."task8_isCorrect" +
                                C."task9_isCorrect" +
                                C."task10_isCorrect" +
                                C."task11_isCorrect" +
                                C."task12_isCorrect" +
                                C."task13_isCorrect" +
                                C."task14_isCorrect" +
                                C."task15_isCorrect" +
                                C."task16_isCorrect" +
                                C."task17_isCorrect" +
                                C."task18_isCorrect" +
                                C."task19_isCorrect" +
                                C."task20_isCorrect" +
                                C."task21_isCorrect" +
                                C."task22_isCorrect" +
                                C."task23_isCorrect" +
                                C."task24_isCorrect"
                            ) "total_isCorrect"
                 from (select CCT.id,
                              CCT."createdAt",
                              CCT."userId",
                              CCT."testId",
                              --        CCT.time,
                              --        CCT."actualAnswer",
                              --        CCT.correct,

                              CCT."actualAnswer"[1]  "task1_completed_answer",
                              CCT."actualAnswer"[2]  "task2_completed_answer",
                              CCT."actualAnswer"[3]  "task3_completed_answer",
                              CCT."actualAnswer"[4]  "task4_completed_answer",
                              CCT."actualAnswer"[5]  "task5_completed_answer",
                              CCT."actualAnswer"[6]  "task6_completed_answer",
                              CCT."actualAnswer"[7]  "task7_completed_answer",
                              CCT."actualAnswer"[8]  "task8_completed_answer",
                              CCT."actualAnswer"[9]  "task9_completed_answer",
                              CCT."actualAnswer"[10] "task10_completed_answer",
                              CCT."actualAnswer"[11] "task11_completed_answer",
                              CCT."actualAnswer"[12] "task12_completed_answer",
                              CCT."actualAnswer"[13] "task13_completed_answer",
                              CCT."actualAnswer"[14] "task14_completed_answer",
                              CCT."actualAnswer"[15] "task15_completed_answer",
                              CCT."actualAnswer"[16] "task16_completed_answer",
                              CCT."actualAnswer"[17] "task17_completed_answer",
                              CCT."actualAnswer"[18] "task18_completed_answer",
                              CCT."actualAnswer"[19] "task19_completed_answer",
                              CCT."actualAnswer"[20] "task20_completed_answer",
                              CCT."actualAnswer"[21] "task21_completed_answer",
                              CCT."actualAnswer"[22] "task22_completed_answer",
                              CCT."actualAnswer"[23] "task23_completed_answer",
                              CCT."actualAnswer"[24] "task24_completed_answer",
                              time[1]                "task1_completed_time",
                              time[2]                "task2_completed_time",
                              time[3]                "task3_completed_time",
                              time[4]                "task4_completed_time",
                              time[5]                "task5_completed_time",
                              time[6]                "task6_completed_time",
                              time[7]                "task7_completed_time",
                              time[8]                "task8_completed_time",
                              time[9]                "task9_completed_time",
                              time[10]               "task10_completed_time",
                              time[11]               "task11_completed_time",
                              time[12]               "task12_completed_time",
                              time[13]               "task13_completed_time",
                              time[14]               "task14_completed_time",
                              time[15]               "task15_completed_time",
                              time[16]               "task16_completed_time",
                              time[17]               "task17_completed_time",
                              time[18]               "task18_completed_time",
                              time[19]               "task19_completed_time",
                              time[20]               "task20_completed_time",
                              time[21]               "task21_completed_time",
                              time[22]               "task22_completed_time",
                              time[23]               "task23_completed_time",
                              time[24]               "task24_completed_time",
                              correct[1] ::integer   "task1_isCorrect",
                              correct[2] ::integer   "task2_isCorrect",
                              correct[3] ::integer   "task3_isCorrect",
                              correct[4] ::integer   "task4_isCorrect",
                              correct[5] ::integer   "task5_isCorrect",
                              correct[6] ::integer   "task6_isCorrect",
                              correct[7] ::integer   "task7_isCorrect",
                              correct[8] ::integer   "task8_isCorrect",
                              correct[9] ::integer   "task9_isCorrect",
                              correct[10]::integer   "task10_isCorrect",
                              correct[11]::integer   "task11_isCorrect",
                              correct[12]::integer   "task12_isCorrect",
                              correct[13]::integer   "task13_isCorrect",
                              correct[14]::integer   "task14_isCorrect",
                              correct[15]::integer   "task15_isCorrect",
                              correct[16]::integer   "task16_isCorrect",
                              correct[17]::integer   "task17_isCorrect",
                              correct[18]::integer   "task18_isCorrect",
                              correct[19]::integer   "task19_isCorrect",
                              correct[20]::integer   "task20_isCorrect",
                              correct[21]::integer   "task21_isCorrect",
                              correct[22]::integer   "task22_isCorrect",
                              correct[23]::integer   "task23_isCorrect",
                              correct[24]::integer   "task24_isCorrect"

                       from (select CTe.id,
                                    CTe."createdAt",
                                    CTe."userId",
                                    CTe."testId",
                                    array_agg(CTa.time)    time,
                                    array_agg(CTa.answer)  "actualAnswer",
                                    array_agg(CTa.correct) correct

                             from "CompletedTest" CTe
                                      join "CompletedTask" CTa on CTe.id = CTa."testId"
                             group by CTe.id, CTe."createdAt", CTe."userId", CTe."testId") CCT) C;
end
$$ language plpgsql;

CREATE EXTENSION IF NOT EXISTS tablefunc;

select *
from get_user_info_data();

select *
from get_emotion_test_data();

select *
from get_depression_test_data();
