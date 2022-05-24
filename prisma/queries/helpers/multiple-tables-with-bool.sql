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
                "isRightHanded"                 bool,
                "fieldOfActivity"               text,
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
                        (UI.info::json ->> 'isRightHanded')::bool                 as "isRightHanded",
                        (UI.info::json ->> 'fieldOfActivity')::text               as "fieldOfActivity",
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
                "task1_completed_time"    double precision,
                "task1_completed_answer"  integer,
                "task1_isCorrect"         bool,
                "task2_completed_time"    double precision,
                "task2_completed_answer"  integer,
                "task2_isCorrect"         bool,
                "task3_completed_time"    double precision,
                "task3_completed_answer"  integer,
                "task3_isCorrect"         bool,
                "task4_completed_time"    double precision,
                "task4_completed_answer"  integer,
                "task4_isCorrect"         bool,
                "task5_completed_time"    double precision,
                "task5_completed_answer"  integer,
                "task5_isCorrect"         bool,
                "task6_completed_time"    double precision,
                "task6_completed_answer"  integer,
                "task6_isCorrect"         bool,
                "task7_completed_time"    double precision,
                "task7_completed_answer"  integer,
                "task7_isCorrect"         bool,
                "task8_completed_time"    double precision,
                "task8_completed_answer"  integer,
                "task8_isCorrect"         bool,
                "task9_completed_time"    double precision,
                "task9_completed_answer"  integer,
                "task9_isCorrect"         bool,
                "task10_completed_time"   double precision,
                "task10_completed_answer" integer,
                "task10_isCorrect"        bool,
                "task11_completed_time"   double precision,
                "task11_completed_answer" integer,
                "task11_isCorrect"        bool,
                "task12_completed_time"   double precision,
                "task12_completed_answer" integer,
                "task12_isCorrect"        bool,
                "task13_completed_time"   double precision,
                "task13_completed_answer" integer,
                "task13_isCorrect"        bool,
                "task14_completed_time"   double precision,
                "task14_completed_answer" integer,
                "task14_isCorrect"        bool,
                "task15_completed_time"   double precision,
                "task15_completed_answer" integer,
                "task15_isCorrect"        bool,
                "task16_completed_time"   double precision,
                "task16_completed_answer" integer,
                "task16_isCorrect"        bool,
                "task17_completed_time"   double precision,
                "task17_completed_answer" integer,
                "task17_isCorrect"        bool,
                "task18_completed_time"   double precision,
                "task18_completed_answer" integer,
                "task18_isCorrect"        bool,
                "task19_completed_time"   double precision,
                "task19_completed_answer" integer,
                "task19_isCorrect"        bool,
                "task20_completed_time"   double precision,
                "task20_completed_answer" integer,
                "task20_isCorrect"        bool,
                "task21_completed_time"   double precision,
                "task21_completed_answer" integer,
                "task21_isCorrect"        bool,
                "task22_completed_time"   double precision,
                "task22_completed_answer" integer,
                "task22_isCorrect"        bool,
                "task23_completed_time"   double precision,
                "task23_completed_answer" integer,
                "task23_isCorrect"        bool,
                "task24_completed_time"   double precision,
                "task24_completed_answer" integer,
                "task24_isCorrect"        bool
            )
as
$$
begin
    return query select CCT.id,
                        CCT."createdAt",
                        CCT."userId",
                        CCT."testId",
--        CCT.time,
--        CCT."actualAnswer",
--        CCT.correct,

                        time[1]                "task1_completed_time",
                        CCT."actualAnswer"[1]  "task1_completed_answer",
                        correct[1]             "task1_isCorrect",

                        time[2]                "task2_completed_time",
                        CCT."actualAnswer"[2]  "task2_completed_answer",
                        correct[2]             "task2_isCorrect",

                        time[3]                "task3_completed_time",
                        CCT."actualAnswer"[3]  "task3_completed_answer",
                        correct[3]             "task3_isCorrect",

                        time[4]                "task4_completed_time",
                        CCT."actualAnswer"[4]  "task4_completed_answer",
                        correct[4]             "task4_isCorrect",

                        time[5]                "task5_completed_time",
                        CCT."actualAnswer"[5]  "task5_completed_answer",
                        correct[5]             "task5_isCorrect",

                        time[6]                "task6_completed_time",
                        CCT."actualAnswer"[6]  "task6_completed_answer",
                        correct[6]             "task6_isCorrect",

                        time[7]                "task7_completed_time",
                        CCT."actualAnswer"[7]  "task7_completed_answer",
                        correct[7]             "task7_isCorrect",

                        time[8]                "task8_completed_time",
                        CCT."actualAnswer"[8]  "task8_completed_answer",
                        correct[8]             "task8_isCorrect",

                        time[9]                "task9_completed_time",
                        CCT."actualAnswer"[9]  "task9_completed_answer",
                        correct[9]             "task9_isCorrect",

                        time[10]               "task10_completed_time",
                        CCT."actualAnswer"[10] "task10_completed_answer",
                        correct[10]            "task10_isCorrect",

                        time[11]               "task11_completed_time",
                        CCT."actualAnswer"[11] "task11_completed_answer",
                        correct[11]            "task11_isCorrect",

                        time[12]               "task12_completed_time",
                        CCT."actualAnswer"[12] "task12_completed_answer",
                        correct[12]            "task12_isCorrect",

                        time[13]               "task13_completed_time",
                        CCT."actualAnswer"[13] "task13_completed_answer",
                        correct[13]            "task13_isCorrect",

                        time[14]               "task14_completed_time",
                        CCT."actualAnswer"[14] "task14_completed_answer",
                        correct[14]            "task14_isCorrect",

                        time[15]               "task15_completed_time",
                        CCT."actualAnswer"[15] "task15_completed_answer",
                        correct[15]            "task15_isCorrect",

                        time[16]               "task16_completed_time",
                        CCT."actualAnswer"[16] "task16_completed_answer",
                        correct[16]            "task16_isCorrect",

                        time[17]               "task17_completed_time",
                        CCT."actualAnswer"[17] "task17_completed_answer",
                        correct[17]            "task17_isCorrect",

                        time[18]               "task18_completed_time",
                        CCT."actualAnswer"[18] "task18_completed_answer",
                        correct[18]            "task18_isCorrect",

                        time[19]               "task19_completed_time",
                        CCT."actualAnswer"[19] "task19_completed_answer",
                        correct[19]            "task19_isCorrect",

                        time[20]               "task20_completed_time",
                        CCT."actualAnswer"[20] "task20_completed_answer",
                        correct[20]            "task20_isCorrect",

                        time[21]               "task21_completed_time",
                        CCT."actualAnswer"[21] "task21_completed_answer",
                        correct[21]            "task21_isCorrect",

                        time[22]               "task22_completed_time",
                        CCT."actualAnswer"[22] "task22_completed_answer",
                        correct[22]            "task22_isCorrect",

                        time[23]               "task23_completed_time",
                        CCT."actualAnswer"[23] "task23_completed_answer",
                        correct[23]            "task23_isCorrect",

                        time[24]               "task24_completed_time",
                        CCT."actualAnswer"[24] "task24_completed_answer",
                        correct[24]            "task24_isCorrect"

                 from (select CTe.id,
                              CTe."createdAt",
                              CTe."userId",
                              CTe."testId",
                              array_agg(CTa.time)    time,
                              array_agg(CTa.answer)  "actualAnswer",
                              array_agg(CTa.correct) correct

                       from "CompletedTest" CTe
                                join "CompletedTask" CTa on CTe.id = CTa."testId"
                       group by CTe.id, CTe."createdAt", CTe."userId", CTe."testId") CCT;
end
$$ language plpgsql;

select *
from get_user_info_data();

select *
from get_emotion_test_data();

select *
from get_depression_test_data();
