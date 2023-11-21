
import { Static, Type } from '@sinclair/typebox';

export const PowerMode = Type.Object({
    mode: Type.String()
});

export const powerModeSchema = {
    body: {
        type: 'object',
        required: ['mode'],
        properties: {
            mode: { type: 'string' }
        }
    }
};

export type PowerModeBody = Static<typeof PowerMode>;