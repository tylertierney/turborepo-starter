import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  toast,
} from '@repo/ui'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { authClient } from '../../../auth-client'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'

const emailValidator = ({ value }: { value: string }) => {
  const res = z.email().safeParse(value)

  return res.success ? [] : res.error.issues.map(({ message }) => message)
}

const passwordValidator = ({ value }: { value: string }) => {
  if (value.length < 1) return ['Password is required.']
  return []
}

export type FormValues = {
  email: string
  password: string
}

export const Login = () => {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies FormValues,
  })

  const { mutate: submit, isPending } = useMutation({
    mutationKey: ['login-submission'],
    mutationFn: async () => {
      if (!form.state.isValid) return

      const res = await authClient.signIn.email({
        email: form.state.values.email,
        password: form.state.values.password,
      })

      if (!res || res.error) {
        throw new Error(res.error.message || 'Something went wrong')
      }
    },
    onSuccess: () => {
      toast.add({
        type: 'Success',
        title: 'Success',
        description: `Successfully signed in`,
      })
      navigate('/app')
    },
    onError: (err) => {
      toast.add({
        type: 'error',
        title: 'Error',
        description: err.message ?? 'Something went wrong',
      })
    },
  })

  return (
    <div className="flex flex-col items-center p-4 mt-20">
      <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>
      <p className="mb-10 text-center">
        Sign in using your employer-provided email and password.
      </p>
      <form
        className="flex w-full max-w-md flex-col"
        onSubmit={async (e) => {
          e.preventDefault()
          submit()
        }}
      >
        <FieldGroup>
          <FieldSet className="gap-6 mb-6">
            <FieldGroup>
              <Field>
                <form.Field
                  name="email"
                  validators={{
                    onChange: emailValidator,
                    onMount: emailValidator,
                  }}
                  children={(f) => {
                    return (
                      <>
                        <FieldLabel htmlFor="email">
                          <span className="text-destructive">*</span>
                          Email
                        </FieldLabel>

                        <Input
                          id="email"
                          type="email"
                          placeholder="johndoe@email.com"
                          onBlur={f.handleBlur}
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                        />
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <form.Field
                  name="password"
                  validators={{
                    onChange: passwordValidator,
                    onMount: passwordValidator,
                  }}
                  children={(f) => {
                    const errors = f.state.meta.errors
                    const isInvalid =
                      !f.state.meta.isValid &&
                      f.state.meta.isDirty &&
                      errors.length > 0
                    return (
                      <>
                        <FieldLabel htmlFor="password">
                          <span className="text-destructive">*</span>
                          Password
                        </FieldLabel>
                        <Input
                          id="password"
                          placeholder=""
                          type="password"
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={isInvalid}
                          value={f.state.value}
                          disabled={isPending}
                        />
                        {isInvalid &&
                          errors.map((err, idx) => (
                            <FieldError key={idx}>{err}</FieldError>
                          ))}
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="vertical" className="gap-2">
            <form.Subscribe
              selector={(form) => ({
                isPristine: form.isPristine,
                valid: form.isValid,
              })}
              children={({ valid, isPristine }) => (
                <Button
                  disabled={!valid || isPristine || isPending}
                  type="submit"
                  className="w-full py-6 mb-4"
                >
                  Submit
                </Button>
              )}
            />

            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="w-full py-6"
              nativeButton={false}
              render={<Link to="/">Cancel</Link>}
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
