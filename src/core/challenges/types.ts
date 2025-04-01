
type PositiveNumber = number & { __positiveNumber: true }
type RangedNumber<Min extends number, Max extends number> = number & { __min: Min, __max: Max }

type AutoCreated<T> = Readonly<T>
type CreatedInDatabase<T> = Readonly<T>

type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'horrible'

type ChallengeGamification = {
    baseExperience: CreatedInDatabase<number>;
}

type ChallengeRatings = {
    total: PositiveNumber;
    count: PositiveNumber;
    average: CreatedInDatabase<RangedNumber<0, 5>>;
}

export type Challenge = {
    id: AutoCreated<PositiveNumber>;
    title: CreatedInDatabase<string>;
    slug: CreatedInDatabase<string>;

    difficulty: CreatedInDatabase<ChallengeDifficulty>;
    gamification: ChallengeGamification;
    ratings: ChallengeRatings;
}






